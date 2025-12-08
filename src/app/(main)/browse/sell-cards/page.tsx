'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Camera,
  Upload,
  Sparkles,
  Trash2,
  Loader2,
  CheckCircle2,
  Plus,
  ChevronRight,
  LayoutGrid,
  RefreshCcw,
  Coins,
  Gem,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

// AI Flows
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { findSimilarProducts, FindSimilarProductsOutput } from '@/ai/flows/visual-search';
import { suggestCardPrice, SuggestCardPriceOutput } from '@/ai/flows/suggest-price';
import { generateCardDescription, GenerateCardDescriptionOutput } from '@/ai/flows/generate-description';
import { identifyCard, IdentifyCardOutput } from '@/ai/flows/identify-card';
import { products } from '@/lib/data';

import { CameraCapture } from '@/components/camera-capture';

type AnalysisState = {
  condition?: CheckCardConditionOutput;
  similar?: FindSimilarProductsOutput;
  price?: SuggestCardPriceOutput;
  description?: GenerateCardDescriptionOutput;
  identify?: IdentifyCardOutput;
};

type DraftItem = {
  id: string;
  frontImage: string;
  backImage: string | null;
  status: 'pending' | 'analyzed' | 'listed';
  analysis?: AnalysisState;
};

export default function SellCardsPage() {
  const { user } = useAuth();
  // Store objects instead of just strings
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  // View State
  const [activeCaptureSide, setActiveCaptureSide] = useState<'front' | 'back' | 'binder' | null>(null);
  const [cameraMode, setCameraMode] = useState<'single' | 'binder'>('single');
  const [isSlicing, setIsSlicing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Helper to get current draft
  const currentDraft = drafts.find(d => d.id === activeDraftId);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!activeDraftId) return;

      const index = drafts.findIndex(d => d.id === activeDraftId);

      if (e.key === 'ArrowDown' && index < drafts.length - 1) {
        e.preventDefault();
        setActiveDraftId(drafts[index + 1].id);
      } else if (e.key === 'ArrowUp' && index > 0) {
        e.preventDefault();
        setActiveDraftId(drafts[index - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drafts, activeDraftId]);

  const handleCapture = async (imageData: string) => {
    // Generate a simple ID
    const newId = Math.random().toString(36).substr(2, 9);

    if (cameraMode === 'binder') {
      // Stop camera overlap for slicing visual
      setActiveCaptureSide(null);
      setIsSlicing(true);
      toast({ title: "Processing Binder Page", description: "Slicing into individual cards..." });

      try {
        const response = await fetch('/api/camera/slice-binder-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData }),
        });

        if (!response.ok) throw new Error('Failed to slice binder page');

        const { cards } = await response.json();

        const newCards: DraftItem[] = cards.map((cardImg: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          frontImage: cardImg,
          backImage: null,
          status: 'pending'
        }));

        setDrafts(prev => [...prev, ...newCards]);
        if (!activeDraftId && newCards.length > 0) setActiveDraftId(newCards[0].id);
        toast({ title: "Binder Processed", description: `Added ${newCards.length} cards to drafts.` });

      } catch (error) {
        console.error("Binder slicing failed", error);
        toast({ variant: "destructive", title: "Error", description: "Could not process binder page." });
      } finally {
        setIsSlicing(false);
      }

    } else {
      // Single Capture Logic
      if (activeCaptureSide === 'back' && activeDraftId) {
        // Attach back image to CURRENT draft
        setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, backImage: imageData } : d));
      } else {
        // New Draft
        const newDraft: DraftItem = { id: newId, frontImage: imageData, backImage: null, status: 'pending' };
        setDrafts(prev => [...prev, newDraft]);
        if (!activeDraftId) setActiveDraftId(newId);
      }
      setActiveCaptureSide(null);
    }
  };

  const handleAnalyze = async () => {
    if (!currentDraft) return;
    // Role Check
    if (user?.role !== 'SUPERADMIN' && user?.role !== 'ADMIN') {
      toast({
        variant: "destructive", // or "default" if we want less aggressive
        title: "Access Restricted",
        description: "Only Superadmins can analyze card quality.",
      });
      return;
    }

    if (!currentDraft?.frontImage || !currentDraft?.backImage) {
      toast({
        variant: "destructive",
        title: "Images Required",
        description: "Please capture both Front and Back images for analysis.",
      });
      return;
    }
    setIsLoading(true);

    try {
      // 1. Run Identification, Condition, and Visual Search
      const identifyPromise = identifyCard({
        frontImageUri: currentDraft.frontImage,
        backImageUri: currentDraft.backImage || undefined
      });

      const conditionPromise = currentDraft.backImage ? checkCardCondition({
        frontImageUri: currentDraft.frontImage,
        backImageUri: currentDraft.backImage
      }) : Promise.resolve(undefined);

      const similarPromise = findSimilarProducts({ productImageUri: currentDraft.frontImage, category: 'Collector Cards' });

      const [identify, condition, similar] = await Promise.all([identifyPromise, conditionPromise, similarPromise]);

      // 2. Prepare data for Price/Description
      const cardName = identify.cardName || 'Unknown Card';
      const cardDetails = [
        identify.year && `Year: ${identify.year}`,
        identify.set && `Set: ${identify.set}`,
        identify.cardNumber && `Card #: ${identify.cardNumber}`,
        identify.manufacturer && `Manufacturer: ${identify.manufacturer}`,
        identify.details
      ].filter(Boolean).join(', ');

      const similarListingsText = similar.similarProducts.map(p => {
        const product = products.find(db_p => db_p.id.startsWith('prod_'));
        return `${p.productName}: ~$${product?.price || 'N/A'}`;
      }).join(', ');

      const overallGrade = condition?.overallGrade || 'Ungraded';

      const pricePromise = suggestCardPrice({
        cardName,
        condition: overallGrade,
        similarListings: similarListingsText
      });

      const descriptionPromise = generateCardDescription({
        cardName,
        cardDetails,
        conditionReport: condition ? JSON.stringify(condition) : 'No condition report available (back image missing).'
      });

      const [price, description] = await Promise.all([pricePromise, descriptionPromise]);

      // Update the draft with results
      setDrafts(prev => prev.map(d => d.id === activeDraftId ? {
        ...d,
        status: 'analyzed',
        analysis: { identify, condition, similar, price, description }
      } : d));

    } catch (error) {
      console.error('Analysis failed', error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the card.' });
    } finally {
      setIsLoading(false);
    }
  };

  const removeDraft = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDrafts(prev => prev.filter(d => d.id !== id));
    if (activeDraftId === id) setActiveDraftId(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-muted/5">

      {/* 1. TOP TOOLBAR - High Level Actions */}
      <div className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-10">
        <h1 className="text-xl font-bold font-headline flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Listing Studio
        </h1>

        <div className="flex gap-2">

          {/* File Upload Button */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;

                const newUploadedDrafts: DraftItem[] = [];

                files.forEach(file => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result as string;
                    // Add to state nicely
                    setDrafts(prev => {
                      const newDraft: DraftItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        frontImage: base64,
                        backImage: null,
                        status: 'pending'
                      };
                      // Set active if none
                      if (prev.length === 0) setTimeout(() => setActiveDraftId(newDraft.id), 0);
                      return [...prev, newDraft];
                    });
                  };
                  reader.readAsDataURL(file);
                });

                // Reset input
                e.target.value = '';
                toast({ title: "Images Uploaded", description: `Processing ${files.length} images...` });
              }}
            />
            <Button variant="secondary">
              <Upload className="mr-2 w-4 h-4" /> Upload
            </Button>
          </div>

          <Button variant="outline" onClick={() => { setCameraMode('binder'); setActiveCaptureSide('binder'); }}>
            <LayoutGrid className="w-4 h-4 mr-2" />
            Binder Scan
          </Button>
          <Button onClick={() => { setCameraMode('single'); setActiveCaptureSide('front'); }}>
            <Camera className="w-4 h-4 mr-2" />
            Add Single Card
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* 2. LEFT SIDEBAR - The Queue */}
        <div className="w-80 border-r bg-background flex flex-col">

          {/* Navigation */}
          <div className="p-4 border-b">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
              Selling Category
            </h2>
            <div className="space-y-1">
              <Button variant="secondary" className="w-full justify-start">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Collector Cards
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Graded Cards
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/sell-coins">
                  <Coins className="mr-2 h-4 w-4" />
                  Sell Coins
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/sell-collectibles">
                  <Gem className="mr-2 h-4 w-4" />
                  Sell Collectibles
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <span className="font-semibold text-sm text-muted-foreground">Queue ({drafts.length})</span>
            {drafts.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setDrafts([])} className="text-xs h-6">Clear</Button>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {drafts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No cards in queue.<br />Start capturing or uploading!
                </div>
              ) : (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => setActiveDraftId(draft.id)}
                    className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeDraftId === draft.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0 border">
                      <Image src={draft.frontImage} alt="Thumbnail" layout="fill" objectFit="cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium truncate">
                        {draft.analysis?.identify?.cardName || 'Untitled Card'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {draft.status === 'analyzed' ? (
                          <Badge variant="secondary" className="text-[10px] px-1 h-5 bg-green-100 text-green-700">Ready</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1 h-5">Pending</Badge>
                        )}
                        {draft.backImage && <span className="text-[10px] text-muted-foreground">F+B</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={(e) => removeDraft(e, draft.id)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">

          {/* Camera Overlay */}
          {activeCaptureSide && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col">
              <CameraCapture
                onCapture={handleCapture}
                onClose={() => setActiveCaptureSide(null)}
                className="flex-1"
                mode={cameraMode}
                onModeChange={setCameraMode}
              />
            </div>
          )}

          {/* Loading / Slicing State Overlay */}
          {isSlicing && (
            <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Slicing Binder Page...</p>
              </div>
            </div>
          )}

          {!currentDraft ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
              <Camera className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a card from the queue</p>
              <p className="text-sm">Or capture new cards to get started</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">

              {/* Left Col: Images */}
              <div className="space-y-4">
                <Card className="overflow-hidden border-none shadow-md bg-muted/20">
                  <div className="aspect-[3/4] relative flex items-center justify-center">
                    <Image src={currentDraft.frontImage} alt="Front" layout="fill" objectFit="contain" className="p-4" />
                  </div>
                  <div className="grid grid-cols-2 border-t divide-x bg-background">
                    <Button variant="ghost" className="h-12 rounded-none hover:bg-muted" disabled>
                      Front Image
                    </Button>
                    <Button
                      variant="ghost"
                      className={`h-12 rounded-none hover:bg-muted ${!currentDraft.backImage ? 'text-blue-600' : ''}`}
                      onClick={() => setActiveCaptureSide('back')}
                    >
                      {currentDraft.backImage ? 'Retake Back' : '+ Add Back'}
                    </Button>
                  </div>
                </Card>

                {currentDraft.backImage && (
                  <div className="w-20 h-28 relative border rounded overflow-hidden">
                    <Image src={currentDraft.backImage} alt="Back" layout="fill" objectFit="cover" />
                  </div>
                )}
              </div>

              {/* Right Col: Data & Actions */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-1">
                    {currentDraft.analysis?.identify?.cardName || 'New Listing'}
                  </h2>
                  <p className="text-muted-foreground text-sm">ID: {currentDraft.id}</p>
                </div>

                {!currentDraft.analysis ? (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 flex flex-col items-center text-center p-8">
                      <Sparkles className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-semibold mb-2">Ready to Identify</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        We will analyze the image to detect the Card Name, Set, Number, and Condition.
                      </p>
                      <Button size="lg" className="w-full" onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Analyze Card
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6" key={currentDraft.id}>
                    {/* Identified Data Form */}
                    <div className="grid gap-4">
                      {/* Graded Toggle */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="graded"
                          onCheckedChange={(checked) => {
                            // We'll use a local state or just handle conditional rendering here
                            // For now, let's just toggle a class or state 
                            const el = document.getElementById('graded-fields');
                            if (el) el.style.display = checked ? 'grid' : 'none';
                          }}
                        />
                        <Label htmlFor="graded" className="cursor-pointer font-medium">Is this a Graded Card?</Label>
                      </div>

                      {/* Graded Fields (Hidden by default) */}
                      <div id="graded-fields" className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/20" style={{ display: 'none' }}>
                        <div className="space-y-2">
                          <Label>Grading Company</Label>
                          <Input placeholder="e.g. PSA, BGS" />
                        </div>
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Input placeholder="e.g. 10, 9.5" />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Certification Number</Label>
                          <Input placeholder="e.g. 12345678" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Card Name */}
                        <div className="space-y-2 col-span-2">
                          <Label>Card Name</Label>
                          <div className="flex gap-2">
                            <Input defaultValue={currentDraft.analysis.identify?.cardName} />
                            <Button variant="outline" size="icon" onClick={() => {
                              setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, status: 'pending', analysis: undefined } : d));
                            }}>
                              <RefreshCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Set / Expansion</Label>
                          <Input defaultValue={currentDraft.analysis.identify?.set} />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input defaultValue={currentDraft.analysis.identify?.year} />
                        </div>
                        <div className="space-y-2">
                          <Label>Card #</Label>
                          <Input defaultValue={currentDraft.analysis.identify?.cardNumber} />
                        </div>
                        <div className="space-y-2">
                          <Label>Manufacturer</Label>
                          <Input defaultValue={currentDraft.analysis.identify?.manufacturer} />
                        </div>
                      </div>

                      {/* Condition */}
                      <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <h3 className="font-semibold flex items-center gap-2 text-orange-600 mb-2"><CheckCircle2 className="w-4 h-4" /> Condition: {currentDraft.analysis.condition?.overallGrade}</h3>
                        <div className="grid grid-cols-2 gap-y-1 text-sm text-foreground/80">
                          <span>Corners: {currentDraft.analysis.condition?.corners}</span>
                          <span>Edges: {currentDraft.analysis.condition?.edges}</span>
                        </div>
                      </div>

                      {/* Price Card */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <Label className="text-green-800">Suggested Price</Label>
                          <div className="text-2xl font-bold text-green-700">
                            ${currentDraft.analysis.price?.suggestedPrice.toFixed(2)}
                          </div>
                          <p className="text-xs text-green-600">
                            Range: ${currentDraft.analysis.price?.priceRange.min} - ${currentDraft.analysis.price?.priceRange.max}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          if (!currentDraft.analysis?.price || !currentDraft.analysis?.identify) return;

                          setIsLoading(true);
                          try {
                            const { createListing } = await import('@/actions/create-listing');

                            const images = [currentDraft.frontImage];
                            if (currentDraft.backImage) images.push(currentDraft.backImage);

                            const result = await createListing({
                              name: currentDraft.analysis.identify.cardName || 'Untitled Card',
                              description: currentDraft.analysis.description?.description || 'No description generated.',
                              price: currentDraft.analysis.price.suggestedPrice,
                              category: 'Collector Cards',
                              images: images,
                              year: currentDraft.analysis.identify.year ? parseInt(currentDraft.analysis.identify.year) : undefined,
                              imageHint: currentDraft.backImage ? 'front,back' : 'front',
                            });

                            if (result.success) {
                              toast({
                                title: 'Success!',
                                description: 'Your card has been listed for sale.',
                                className: 'bg-green-600 text-white border-none'
                              });
                              // Mark as listed
                              setDrafts(prev => prev.map(d => d.id === activeDraftId ? { ...d, status: 'listed' } : d));
                            } else {
                              throw new Error(result.error);
                            }
                          } catch (err: any) {
                            toast({
                              variant: 'destructive',
                              title: 'Listing Failed',
                              description: err.message || 'Could not save to database.'
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading || currentDraft.status === 'listed'}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {currentDraft.status === 'listed' ? 'Listed Successfully' : 'Publish Listing'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
