
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Camera,
  Upload,
  Sparkles,
  Search,
  Tag,
  FileText,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { findSimilarProducts, FindSimilarProductsOutput } from '@/ai/flows/visual-search';
import { suggestCardPrice, SuggestCardPriceOutput } from '@/ai/flows/suggest-price';
import { generateCardDescription, GenerateCardDescriptionOutput } from '@/ai/flows/generate-description';
import { products } from '@/lib/data';

type AnalysisState = {
  condition?: CheckCardConditionOutput;
  similar?: FindSimilarProductsOutput;
  price?: SuggestCardPriceOutput;
  description?: GenerateCardDescriptionOutput;
};

export default function SellCardsPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings.',
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video to capture full frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
      }
    }
  };
  
  const handleAnalyze = async () => {
    if (!imageSrc) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const conditionPromise = checkCardCondition({ cardImageUri: imageSrc });
      const similarPromise = findSimilarProducts({ productImageUri: imageSrc, category: 'Collector Cards' });
      
      const [condition, similar] = await Promise.all([conditionPromise, similarPromise]);

      const similarListingsText = similar.similarProducts.map(p => {
        const product = products.find(db_p => db_p.id.startsWith('prod_'));
        return `${p.productName}: ~$${product?.price || 'N/A'}`;
      }).join(', ');
      
      const pricePromise = suggestCardPrice({ cardName: 'Unknown Card', condition: condition.overallGrade, similarListings: similarListingsText });
      const descriptionPromise = generateCardDescription({ cardName: 'Unknown Card', cardDetails: 'Details Identified from Image', conditionReport: JSON.stringify(condition) });

      const [price, description] = await Promise.all([pricePromise, descriptionPromise]);
      
      setAnalysis({ condition, similar, price, description });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the card image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setAnalysis(null);
    setIsLoading(false);
  };

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Sell Your Collector Card</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Use your camera to get an AI-powered condition check, price suggestion, and description.
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid gap-8 mt-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera />
              <span>Capture Card Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden border-2 border-dashed rounded-lg aspect-[1/1.4] border-primary/50">
              {imageSrc ? (
                <Image src={imageSrc} alt="Captured trading card" layout="fill" objectFit="contain" />
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              )}
               {!imageSrc && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[90%] aspect-[1/1.4] border-4 border-white/50 rounded-xl" />
                </div>}
            </div>

            {hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Not Available</AlertTitle>
                <AlertDescription>
                  Camera access is required. Please check your browser settings and refresh the page.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 mt-4">
              {imageSrc ? (
                 <>
                  <Button onClick={reset} className="w-full" variant="outline">
                    <RefreshCcw className="mr-2" />
                    Retake
                  </Button>
                  <Button onClick={handleAnalyze} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                    Analyze Card
                  </Button>
                 </>
              ) : (
                <Button onClick={captureImage} className="w-full" disabled={!hasCameraPermission}>
                  <Camera className="mr-2" />
                  Capture
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles />
              <span>AI Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>}
            {!isLoading && !analysis && (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Analysis results will appear here after capturing and analyzing an image.</p>
              </div>
            )}
            {analysis && (
              <div className="space-y-4">
                {analysis.condition && (
                   <div>
                    <h3 className="font-semibold flex items-center gap-2"><Search/> Condition Report</h3>
                    <div className="p-3 mt-1 text-sm rounded-md bg-muted">
                        <p><strong>Overall Grade:</strong> {analysis.condition.overallGrade}</p>
                        <p><strong>Corners:</strong> {analysis.condition.corners}</p>
                        <p><strong>Edges:</strong> {analysis.condition.edges}</p>
                        <p><strong>Surface:</strong> {analysis.condition.surface}</p>
                        <p><strong>Centering:</strong> {analysis.condition.centering}</p>
                    </div>
                  </div>
                )}
                {analysis.price && (
                   <div>
                    <h3 className="font-semibold flex items-center gap-2"><Tag/> Price Suggestion</h3>
                    <div className="p-3 mt-1 text-sm rounded-md bg-muted">
                        <p><strong>Suggested:</strong> ${analysis.price.suggestedPrice.toFixed(2)}</p>
                        <p><strong>Range:</strong> ${analysis.price.priceRange.min.toFixed(2)} - ${analysis.price.priceRange.max.toFixed(2)}</p>
                         <p className="mt-2 text-xs"><i>{analysis.price.justification}</i></p>
                    </div>
                  </div>
                )}
                {analysis.description && (
                  <div>
                    <h3 className="font-semibold flex items-center gap-2"><FileText/> Generated Description</h3>
                    <p className="p-3 mt-1 text-sm rounded-md bg-muted">{analysis.description.description}</p>
                  </div>
                )}
                 <Button className="w-full">
                    <Upload className="mr-2" /> List for Sale
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
