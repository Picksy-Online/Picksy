"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { createWantedItem } from "@/services/product-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, RefreshCcw, Crop, AlertCircle } from "lucide-react";
import { ImageCropper } from "@/components/image-cropper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CATEGORIES = [
    "Collector Cards",
    "Collectable Coins",
    "Fashion",
    "Home & Living",
    "Vintage",
    "Other",
];

export function WantedForm() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetPrice: "",
        category: "",
    });

    // Image Capture State
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [uncroppedImageSrc, setUncroppedImageSrc] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
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
            }
        };
        getCameraPermission();
    }, []);

    const captureImage = () => {
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
        setImageSrc(croppedImage);
        setIsCropperOpen(false);
    };

    const resetImage = () => {
        setImageSrc(null);
        setUncroppedImageSrc(null);
    };

    const openCropper = () => {
        if (uncroppedImageSrc) {
            setIsCropperOpen(true);
        } else if (imageSrc) {
            setUncroppedImageSrc(imageSrc);
            setIsCropperOpen(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            await createWantedItem({
                title: formData.title,
                description: formData.description,
                targetPrice: parseFloat(formData.targetPrice),
                category: formData.category,
                creatorId: user.id,
                imageUrl: imageSrc || undefined,
            });

            toast({
                title: "Success",
                description: "Your wanted item has been posted.",
            });
            router.push("/wanted");
        } catch (error) {
            console.error("Failed to create wanted item:", error);
            toast({
                title: "Error",
                description: "Failed to post wanted item. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-6 border rounded-lg shadow-sm bg-card">
            <canvas ref={canvasRef} className="hidden" />

            <ImageCropper
                imageSrc={uncroppedImageSrc}
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
                initialAspectRatio={4 / 3} // Standard size for wanted items
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="What are you looking for?"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price ($)</Label>
                    <Input
                        id="targetPrice"
                        name="targetPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="How much are you willing to pay?"
                        value={formData.targetPrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the condition, specifics, etc."
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Reference Image (Optional)</Label>
                    <div className="relative w-full max-w-[300px] mx-auto overflow-hidden border-2 border-dashed rounded-lg aspect-[4/3] border-primary/50 bg-muted/20">
                        {imageSrc ? (
                            <Image src={imageSrc} alt="Captured item" layout="fill" objectFit="contain" />
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
                            <div className="w-[90%] aspect-[4/3] border-4 border-white/50 rounded-xl" />
                        </div>}
                    </div>

                    {hasCameraPermission === false && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Not Available</AlertTitle>
                            <AlertDescription>
                                Camera access is required to capture an image.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2 mt-2">
                        {imageSrc ? (
                            <>
                                <Button type="button" onClick={resetImage} className="flex-1" variant="outline">
                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                    Retake
                                </Button>
                                <Button type="button" onClick={openCropper} className="flex-1" variant="secondary">
                                    <Crop className="mr-2 h-4 w-4" />
                                    Adjust Crop
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={captureImage} className="w-full" disabled={!hasCameraPermission}>
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Image
                            </Button>
                        )}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        "Post Wanted Item"
                    )}
                </Button>
            </form>
        </div>
    );
}
