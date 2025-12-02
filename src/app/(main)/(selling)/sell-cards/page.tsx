'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Camera,
    Upload,
    Sparkles,
    Search,
    Loader2,
    Crop,
    AlertTriangle,
    X,
    Plus
} from 'lucide-react';
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { ImageCropper } from '@/components/image-cropper';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SellCardsPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Navigation State
    const handleTypeChange = (value: string) => {
        if (value === 'coin') router.push('/sell-coins');
        if (value === 'collectible') router.push('/sell-collectibles');
    };

    // Image State
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [frontImageSrc, setFrontImageSrc] = useState<string | null>(null);
    const [backImageSrc, setBackImageSrc] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);

    const [activeCaptureSide, setActiveCaptureSide] = useState<'front' | 'back' | 'additional' | null>(null);
    const [uncroppedImageSrc, setUncroppedImageSrc] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        cardBrand: '',
        price: '',
        description: '',
        shippingCost: '',
    });

    const [features, setFeatures] = useState({
        autograph: false,
        prizm: false,
        numbered: false,
    });

    const [deliveryMethods, setDeliveryMethods] = useState({
        shipped: false,
        storeCollection: false,
        homeCollection: false,
    });

    // Analysis State
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<CheckCardConditionOutput | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const captureImage = (side: 'front' | 'back' | 'additional') => {
        setActiveCaptureSide(side);
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setUncroppedImageSrc(dataUrl);
                setIsCropperOpen(true);
            }
        }
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

    const handleFeatureChange = (feature: keyof typeof features) => {
        setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
    };

    const handleDeliveryChange = (method: keyof typeof deliveryMethods) => {
        setDeliveryMethods(prev => ({ ...prev, [method]: !prev[method] }));
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
            const condition = await checkCardCondition({
                frontImageUri: frontImageSrc,
                backImageUri: backImageSrc
            });
            setAnalysis(condition);
        } catch (error) {
            console.error('Analysis failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the card images. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            cardName: '',
            cardNumber: '',
            cardBrand: '',
            price: '',
            description: '',
            shippingCost: '',
        });
        setFeatures({
            autograph: false,
            prizm: false,
            numbered: false,
        });
        setDeliveryMethods({
            shipped: false,
            storeCollection: false,
            homeCollection: false,
        });
        setActiveCaptureSide(null);
        setIsCropperOpen(false);
    };

    const handleSubmit = () => {
        if (!frontImageSrc || !backImageSrc) {
            toast({
                variant: "destructive",
                title: "Images Required",
                description: "Please capture at least Front and Back images.",
            });
            return;
        }
        // Proceed with submission logic...
        toast({
            title: "Listing Created",
            description: "Your card has been listed for sale!",
        });
        resetForm();
    };

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold font-headline">Sell Your Collector Card</h1>
                <Tabs defaultValue="card" onValueChange={handleTypeChange} className="w-[400px]">
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

            <canvas ref={canvasRef} className="hidden" />

            <ImageCropper
                imageSrc={uncroppedImageSrc}
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
                initialAspectRatio={65 / 95}
            />

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Capture Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera />
                                <span>Capture Card Images</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Camera View */}
                            <div className="relative w-full max-w-[300px] mx-auto overflow-hidden border-2 border-dashed rounded-lg aspect-[65/95] border-primary/50 flex items-center justify-center bg-muted/20">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    playsInline
                                />
                            </div>

                            {hasCameraPermission === false && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertTitle>Camera Not Available</AlertTitle>
                                    <AlertDescription>
                                        Camera access is required. Please check your browser settings and refresh the page.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Capture Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-center">Front</p>
                                    {frontImageSrc ? (
                                        <div className="relative aspect-[65/95] border rounded overflow-hidden group">
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
                                        <Button onClick={() => captureImage('front')} className="w-full" variant="outline" disabled={!hasCameraPermission}>
                                            Capture Front
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-center">Back</p>
                                    {backImageSrc ? (
                                        <div className="relative aspect-[65/95] border rounded overflow-hidden group">
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
                                        <Button onClick={() => captureImage('back')} className="w-full" variant="outline" disabled={!hasCameraPermission}>
                                            Capture Back
                                        </Button>
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
                                        disabled={!hasCameraPermission || additionalImages.length >= 3 || ((frontImageSrc ? 1 : 0) + (backImageSrc ? 1 : 0) + additionalImages.length >= 5)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>
                                {additionalImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {additionalImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-[65/95] border rounded overflow-hidden group">
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
                                Analyze Condition
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
                                        {!analysis.isImageQualitySufficient ? (
                                            <Alert variant="destructive">
                                                <AlertTitle>Image Quality Issue</AlertTitle>
                                                <AlertDescription>{analysis.qualityFeedback}</AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div>
                                                <h3 className="font-semibold flex items-center gap-2"><Search /> Condition Report</h3>
                                                <div className="p-3 mt-1 text-sm rounded-md bg-muted">
                                                    <p><strong>Overall Grade:</strong> {analysis.overallGrade}</p>
                                                    <p><strong>Corners:</strong> {analysis.corners}</p>
                                                    <p><strong>Edges:</strong> {analysis.edges}</p>
                                                    <p><strong>Surface:</strong> {analysis.surface}</p>
                                                    <p><strong>Centering:</strong> {analysis.centering}</p>
                                                </div>
                                                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                                                    <AlertTitle className="text-yellow-800">Disclaimer</AlertTitle>
                                                    <AlertDescription className="text-yellow-700 text-xs">
                                                        This AI-generated condition report is an estimate only and does not constitute a professional grading. Actual condition may vary.
                                                    </AlertDescription>
                                                </Alert>
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
                            <div className="space-y-2">
                                <Label htmlFor="cardName">Card Name</Label>
                                <Input
                                    id="cardName"
                                    name="cardName"
                                    placeholder="e.g. Michael Jordan Rookie Card"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="e.g. #23"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cardBrand">Brand/Set</Label>
                                    <Input
                                        id="cardBrand"
                                        name="cardBrand"
                                        placeholder="e.g. Fleer 1986"
                                        value={formData.cardBrand}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Features Checkboxes */}
                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="autograph"
                                        checked={features.autograph}
                                        onCheckedChange={() => handleFeatureChange('autograph')}
                                    />
                                    <Label htmlFor="autograph">Autograph</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="prizm"
                                        checked={features.prizm}
                                        onCheckedChange={() => handleFeatureChange('prizm')}
                                    />
                                    <Label htmlFor="prizm">Prizm</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="numbered"
                                        checked={features.numbered}
                                        onCheckedChange={() => handleFeatureChange('numbered')}
                                    />
                                    <Label htmlFor="numbered">Numbered</Label>
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
                                    placeholder="Describe the card..."
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
