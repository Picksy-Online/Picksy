'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Camera,
    Upload,
    Sparkles,
    Search,
    Tag,
    FileText,
    Loader2,
    RefreshCcw,
    Crop,
    Plus,
    X,
} from 'lucide-react';
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { findSimilarProducts, FindSimilarProductsOutput } from '@/ai/flows/visual-search';
import { suggestCardPrice, SuggestCardPriceOutput } from '@/ai/flows/suggest-price';
import { generateCardDescription, GenerateCardDescriptionOutput } from '@/ai/flows/generate-description';
import { products } from '@/lib/data';
import { ImageCropper } from '@/components/image-cropper';
import { CameraCapture } from '@/components/camera-capture';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type AnalysisState = {
    condition?: CheckCardConditionOutput;
    similar?: FindSimilarProductsOutput;
    price?: SuggestCardPriceOutput;
    description?: GenerateCardDescriptionOutput;
};

export default function SellCoinsPage() {
    const router = useRouter();
    const handleTypeChange = (value: string) => {
        if (value === 'card') router.push('/sell-cards');
        if (value === 'collectible') router.push('/sell-collectibles');
    };

    // Form State
    const [formData, setFormData] = useState({
        denomination: '',
        coinName: '',
        year: '',
        country: '',
        condition: '',
        price: '',
        description: '',
        shippingCost: '',
        // Grading fields
        gradingCompany: '',
        grade: '',
        certNumber: '',
    });

    const [deliveryMethods, setDeliveryMethods] = useState({
        shipped: false,
        storeCollection: false,
        homeCollection: false,
    });

    // Image State
    const [frontImageSrc, setFrontImageSrc] = useState<string | null>(null);
    const [backImageSrc, setBackImageSrc] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);

    const [activeCaptureSide, setActiveCaptureSide] = useState<'front' | 'back' | 'additional' | null>(null);

    // We can keep this if we want to disable buttons before permission is granted, 
    // but CameraCapture handles permission request on mount. 
    // For simplicity, we'll assume permission is handled by the component when active.
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(true);

    const [uncroppedImageSrc, setUncroppedImageSrc] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    // Analysis State
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisState | null>(null);

    const { toast } = useToast();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    setUncroppedImageSrc(result);
                    setIsCropperOpen(true);
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow selecting same file again
        event.target.value = '';
    };

    const captureImage = (side: 'front' | 'back' | 'additional') => {
        setActiveCaptureSide(side);
    };

    const handleCameraCapture = (imageData: string) => {
        setUncroppedImageSrc(imageData);
        setIsCropperOpen(true);
        // Note: activeCaptureSide remains set, so we know where to save after crop
    };

    const handleCropComplete = (croppedImage: string) => {
        if (activeCaptureSide === 'front') {
            setFrontImageSrc(croppedImage);
        } else if (activeCaptureSide === 'back') {
            setBackImageSrc(croppedImage);
        } else if (activeCaptureSide === 'additional') {
            if (additionalImages.length + (frontImageSrc ? 1 : 0) + (backImageSrc ? 1 : 0) < 5) {
                setAdditionalImages([...additionalImages, croppedImage]);
            } else {
                toast({
                    variant: "destructive",
                    title: "Limit Reached",
                    description: "You can only add up to 5 images total.",
                });
            }
        }
        setIsCropperOpen(false);
        setActiveCaptureSide(null);
    };

    const removeAdditionalImage = (index: number) => {
        const newImages = [...additionalImages];
        newImages.splice(index, 1);
        setAdditionalImages(newImages);
    };

    const handleAnalyze = async () => {
        if (!frontImageSrc || !backImageSrc) {
            toast({
                variant: "destructive",
                title: "Images Required",
                description: "Please capture both Front and Back images for analysis.",
            });
            return;
        }

        setIsLoading(true);
        setAnalysis(null);
        try {
            const conditionPromise = checkCardCondition({
                frontImageUri: frontImageSrc,
                backImageUri: backImageSrc
            });
            const similarPromise = findSimilarProducts({ productImageUri: frontImageSrc, category: 'Collector Coins' });

            const [condition, similar] = await Promise.all([conditionPromise, similarPromise]);

            const similarListingsText = similar.similarProducts.map(p => {
                const product = products.find(db_p => db_p.id.startsWith('prod_'));
                return `${p.productName}: ~$${product?.price || 'N/A'}`;
            }).join(', ');

            const pricePromise = suggestCardPrice({ cardName: 'Unknown Coin', condition: condition.overallGrade || 'Unknown', similarListings: similarListingsText });
            const descriptionPromise = generateCardDescription({ cardName: 'Unknown Coin', cardDetails: 'Details Identified from Image', conditionReport: JSON.stringify(condition) });

            const [price, description] = await Promise.all([pricePromise, descriptionPromise]);

            setAnalysis({ condition, similar, price, description });

        } catch (error) {
            console.error('Analysis failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the coin image. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeliveryChange = (method: keyof typeof deliveryMethods) => {
        setDeliveryMethods(prev => ({ ...prev, [method]: !prev[method] }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFrontImageSrc(null);
        setBackImageSrc(null);
        setAdditionalImages([]);
        setUncroppedImageSrc(null);
        setAnalysis(null);
        setFormData({
            denomination: '',
            coinName: '',
            year: '',
            country: '',
            condition: '',
            price: '',
            description: '',
            shippingCost: '',
        });
        setDeliveryMethods({
            shipped: false,
            storeCollection: false,
            homeCollection: false,
        });
        setActiveCaptureSide(null);
        setIsCropperOpen(false);
    };

    // Listing Type State
    const [listingType, setListingType] = useState<'raw' | 'graded'>('raw');

    // ... (existing form data) ...

    const handleSubmit = async () => {
        if (!frontImageSrc || !backImageSrc) {
            toast({
                variant: "destructive",
                title: "Images Required",
                description: "Please capture at least Front and Back images.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { createListing } = await import('@/actions/create-listing');

            // Gather images
            const images = [frontImageSrc, backImageSrc, ...additionalImages];

            const result = await createListing({
                name: formData.coinName || 'Untitled Coin',
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                category: 'Collector Coins',
                images: images,
                year: parseInt(formData.year) || undefined,

                // Coin Specifics
                denomination: formData.denomination,
                country: formData.country,

                // Grading
                isGraded: listingType === 'graded',
                gradingCompany: formData.gradingCompany, // Need to add these to formData state if not there, wait.
                grade: formData.grade,
                certNumber: formData.certNumber,
            });

            if (result.success) {
                toast({
                    title: "Success! 🪙",
                    description: "Your coin has been listed on the marketplace.",
                    className: "bg-green-600 text-white border-none"
                });
                resetForm();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Listing Failed',
                description: error.message || 'Could not save to database.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container px-4 py-8 space-y-8 md:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold font-headline">Sell Your Collector Coin</h1>
                <Tabs defaultValue="coin" onValueChange={handleTypeChange} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Card</TabsTrigger>
                        <TabsTrigger value="coin">Coin</TabsTrigger>
                        <TabsTrigger value="collectible">Collectible</TabsTrigger>
                    </TabsList>
                </Tabs>
                <p className="text-lg text-muted-foreground">
                    Capture Front and Back images for AI analysis. Add up to 5 images total.
                </p>
            </div>

            <ImageCropper
                imageSrc={uncroppedImageSrc}
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
                cropShape="round"
            />

            {/* Full Screen Camera Overlay */}
            {activeCaptureSide && !isCropperOpen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    <CameraCapture
                        onCapture={handleCameraCapture}
                        onClose={() => setActiveCaptureSide(null)}
                        className="flex-1 h-full rounded-none"
                    />
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Capture Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera />
                                <span>Capture Coin Images</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Capture Buttons Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-center">Front</p>
                                    {frontImageSrc ? (
                                        <div className="relative aspect-square border rounded overflow-hidden group">
                                            <Image src={frontImageSrc} alt="Front" layout="fill" objectFit="contain" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setFrontImageSrc(null)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button onClick={() => captureImage('front')} className="flex-1" variant="outline">
                                                Capture Front
                                            </Button>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        setActiveCaptureSide('front');
                                                        handleFileUpload(e);
                                                    }}
                                                />
                                                <Button variant="outline" size="icon">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-center">Back</p>
                                    {backImageSrc ? (
                                        <div className="relative aspect-square border rounded overflow-hidden group">
                                            <Image src={backImageSrc} alt="Back" layout="fill" objectFit="contain" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setBackImageSrc(null)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button onClick={() => captureImage('back')} className="flex-1" variant="outline">
                                                Capture Back
                                            </Button>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        setActiveCaptureSide('back');
                                                        handleFileUpload(e);
                                                    }}
                                                />
                                                <Button variant="outline" size="icon">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">Additional Images ({additionalImages.length}/3)</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => captureImage('additional')}
                                        disabled={additionalImages.length >= 3 || ((frontImageSrc ? 1 : 0) + (backImageSrc ? 1 : 0) + additionalImages.length >= 5)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                    <div className="relative ml-2">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                setActiveCaptureSide('additional');
                                                handleFileUpload(e);
                                            }}
                                            disabled={additionalImages.length >= 3 || ((frontImageSrc ? 1 : 0) + (backImageSrc ? 1 : 0) + additionalImages.length >= 5)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={additionalImages.length >= 3 || ((frontImageSrc ? 1 : 0) + (backImageSrc ? 1 : 0) + additionalImages.length >= 5)}
                                        >
                                            <Upload className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {additionalImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {additionalImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square border rounded overflow-hidden group">
                                                <Image src={img} alt={`Extra ${idx}`} layout="fill" objectFit="contain" />
                                                <button
                                                    onClick={() => removeAdditionalImage(idx)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button onClick={handleAnalyze} className="w-full" disabled={isLoading || !frontImageSrc || !backImageSrc}>
                                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                                Analyze Coin
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Analysis Result */}
                    {analysis && (
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
                                                <h3 className="font-semibold flex items-center gap-2"><Search /> Condition Report</h3>
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
                                                <h3 className="font-semibold flex items-center gap-2"><Tag /> Price Suggestion</h3>
                                                <div className="p-3 mt-1 text-sm rounded-md bg-muted">
                                                    <p><strong>Suggested:</strong> ${analysis.price.suggestedPrice.toFixed(2)}</p>
                                                    <p><strong>Range:</strong> ${analysis.price.priceRange.min.toFixed(2)} - ${analysis.price.priceRange.max.toFixed(2)}</p>
                                                    <p className="mt-2 text-xs"><i>{analysis.price.justification}</i></p>
                                                </div>
                                            </div>
                                        )}
                                        {analysis.description && (
                                            <div>
                                                <h3 className="font-semibold flex items-center gap-2"><FileText /> Generated Description</h3>
                                                <p className="p-3 mt-1 text-sm rounded-md bg-muted">{analysis.description.description}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Listing Details Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload />
                                <span>Listing Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs value={listingType} onValueChange={(v) => setListingType(v as 'raw' | 'graded')} className="w-full mb-6">
                                <TabsList className="grid w-full grid-cols-2 h-10">
                                    <TabsTrigger value="raw">Raw Coin</TabsTrigger>
                                    <TabsTrigger value="graded">Graded Coin</TabsTrigger>
                                </TabsList>
                                <TabsContent value="graded" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Grading Service</Label>
                                            <Input
                                                name="gradingCompany"
                                                value={formData.gradingCompany}
                                                onChange={handleInputChange}
                                                placeholder="e.g. PCGS, NGC"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Grade</Label>
                                            <Input
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleInputChange}
                                                placeholder="e.g. MS70"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cert Number</Label>
                                        <Input
                                            name="certNumber"
                                            value={formData.certNumber}
                                            onChange={handleInputChange}
                                            placeholder="Certification Number"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="space-y-2">
                                <Label htmlFor="coinName">Coin Name</Label>
                                <Input
                                    id="coinName"
                                    name="coinName"
                                    placeholder="e.g. 1988 Bicentennial 50c"
                                    value={formData.coinName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="denomination">Denomination</Label>
                                    <Input
                                        id="denomination"
                                        name="denomination"
                                        placeholder="e.g. 50c"
                                        value={formData.denomination}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        placeholder="e.g. 1988"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        placeholder="e.g. Australia"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">Condition</Label>
                                    <select
                                        id="condition"
                                        name="condition"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Condition</option>
                                        <option value="Sealed">Sealed</option>
                                        <option value="Uncirculated">Uncirculated</option>
                                        <option value="Circulated">Circulated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the coin..."
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Delivery Options */}
                            <div className="space-y-3">
                                <Label>How can it be obtained?</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant={deliveryMethods.shipped ? "default" : "outline"}
                                        onClick={() => handleDeliveryChange('shipped')}
                                        className="flex-1"
                                    >
                                        Shipped
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={deliveryMethods.storeCollection ? "default" : "outline"}
                                        onClick={() => handleDeliveryChange('storeCollection')}
                                        className="flex-1"
                                    >
                                        Store Collection
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={deliveryMethods.homeCollection ? "default" : "outline"}
                                        onClick={() => handleDeliveryChange('homeCollection')}
                                        className="flex-1"
                                    >
                                        Home Collection
                                    </Button>
                                </div>
                                {deliveryMethods.shipped && (
                                    <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="shippingCost">Shipping Cost (Australia Wide) ($)</Label>
                                        <Input
                                            id="shippingCost"
                                            name="shippingCost"
                                            type="number"
                                            placeholder="10.00"
                                            value={formData.shippingCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </div>

                            <Button className="w-full" onClick={handleSubmit}>
                                List Item
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
