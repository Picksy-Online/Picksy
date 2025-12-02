'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Camera,
    Upload,
    Sparkles,
    Search,
    Loader2,
    Crop,
    AlertTriangle,
    X,
    Plus,
    Trash2,
    RefreshCcw,
} from 'lucide-react';
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { ImageCropper } from '@/components/image-cropper';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function SellCollectiblesPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Navigation State
    const handleTypeChange = (value: string) => {
        if (value === 'card') router.push('/sell-cards');
        if (value === 'coin') router.push('/sell-coins');
    };

    // Image State
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [uncroppedImageSrc, setUncroppedImageSrc] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        year: '',
        category: '',
        price: '',
        condition: '',
        shippingCost: '',
    });

    const [deliveryMethods, setDeliveryMethods] = useState({
        shipped: false,
        storeCollection: false,
        homeCollection: false,
    });

    // Analysis State
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<CheckCardConditionOutput | null>(null);

    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setHasCameraPermission(false);
                return;
            }
            try {
                // Stop any existing tracks
                if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode }
                });
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
    }, [toast, facingMode]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const captureImage = () => {
        if (images.length >= 5) {
            toast({
                variant: "destructive",
                title: "Limit Reached",
                description: "You can only add up to 5 images.",
            });
            return;
        }

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
        setImages([...images, croppedImage]);
        setIsCropperOpen(false);
        setUncroppedImageSrc(null);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleDeliveryChange = (method: keyof typeof deliveryMethods) => {
        setDeliveryMethods(prev => ({ ...prev, [method]: !prev[method] }));
    };

    const handleAnalyze = async () => {
        if (images.length < 2) {
            toast({
                variant: "destructive",
                title: "Images Required",
                description: "Please capture at least 2 images for analysis.",
            });
            return;
        }

        setIsLoading(true);
        setAnalysis(null);
        try {
            // Using the first two images for the placeholder analysis
            const condition = await checkCardCondition({
                frontImageUri: images[0],
                backImageUri: images[1]
            });
            setAnalysis(condition);
        } catch (error) {
            console.error('Analysis failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'Could not analyze the item images. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setImages([]);
        setUncroppedImageSrc(null);
        setAnalysis(null);
        setFormData({
            name: '',
            description: '',
            year: '',
            category: '',
            price: '',
            condition: '',
            shippingCost: '',
        });
        setDeliveryMethods({
            shipped: false,
            storeCollection: false,
            homeCollection: false,
        });
        setIsCropperOpen(false);
    };

    const handleSubmit = () => {
        if (images.length < 2) {
            toast({
                variant: "destructive",
                title: "Images Required",
                description: "Please capture at least 2 images.",
            });
            return;
        }
        // Proceed with submission logic...
        toast({
            title: "Listing Created",
            description: "Your collectible has been listed for sale!",
        });
        resetForm();
    };

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold font-headline">Sell Your Collectible</h1>
                <Tabs defaultValue="collectible" onValueChange={handleTypeChange} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Card</TabsTrigger>
                        <TabsTrigger value="coin">Coin</TabsTrigger>
                        <TabsTrigger value="collectible">Collectible</TabsTrigger>
                    </TabsList>
                </Tabs>
                <p className="text-lg text-muted-foreground">
                    Capture at least 2 images of your collectible. Add up to 5 images total.
                </p>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <ImageCropper
                imageSrc={uncroppedImageSrc}
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
                initialAspectRatio={4 / 3}
            />

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Capture Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera />
                                <span>Item Images ({images.length}/5)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Camera View */}
                            {/* Camera View */}
                            <div className="relative w-full max-w-[400px] mx-auto overflow-hidden border-2 border-dashed rounded-lg aspect-[4/3] border-primary/50 flex items-center justify-center bg-muted/20">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    playsInline
                                />

                                {/* Camera Guide Overlay */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className={cn(
                                        "border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center transition-all duration-300",
                                        "w-[60%] h-[80%]"
                                    )}>
                                        <p className="text-white/70 text-sm font-medium bg-black/50 px-2 py-1 rounded">
                                            Align item within frame
                                        </p>
                                    </div>
                                </div>

                                {/* Controls Container */}
                                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                    {/* Flip Camera Button */}
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
                                        onClick={toggleCamera}
                                    >
                                        <RefreshCcw className="h-5 w-5" />
                                        <span className="sr-only">Flip Camera</span>
                                    </Button>
                                </div>
                            </div>

                            {hasCameraPermission === false && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertTitle>Camera Not Available</AlertTitle>
                                    <AlertDescription>
                                        Camera access is required. Please check your browser settings and refresh the page.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button onClick={captureImage} className="w-full" disabled={!hasCameraPermission || images.length >= 5}>
                                <Camera className="w-4 h-4 mr-2" /> Capture Image
                            </Button>

                            {/* Image Gallery */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[4/3] border rounded overflow-hidden group">
                                            <Image src={img} alt={`Item ${idx + 1}`} layout="fill" objectFit="cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                                Image {idx + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button onClick={handleAnalyze} className="w-full" variant="secondary" disabled={isLoading || images.length < 2}>
                                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                                Analyze Condition (Beta)
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
                                                </div>
                                                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                                                    <AlertTitle className="text-yellow-800">Disclaimer</AlertTitle>
                                                    <AlertDescription className="text-yellow-700 text-xs">
                                                        This AI-generated condition report is an estimate only.
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
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Vintage Star Wars Figure"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        placeholder="e.g. 1977"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        placeholder="e.g. Action Figures"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    <Label htmlFor="condition">Condition</Label>
                                    <Select
                                        name="condition"
                                        value={formData.condition}
                                        onValueChange={(value) => handleSelectChange('condition', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Used">Used</SelectItem>
                                            <SelectItem value="Damaged">Damaged</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the item..."
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
