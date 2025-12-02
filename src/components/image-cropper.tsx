'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RotateCcw, ZoomIn, Image as ImageIcon, Check } from 'lucide-react';
import { getCroppedImg } from '@/lib/canvas-utils';

type ImageCropperProps = {
    imageSrc: string | null;
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedImage: string) => void;
    cropShape?: 'rect' | 'round';
    initialAspectRatio?: number;
};

export function ImageCropper({ imageSrc, isOpen, onClose, onCropComplete, cropShape = 'rect', initialAspectRatio = 65 / 95 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    // Default to Portrait (65mm x 95mm) -> Aspect Ratio ~ 0.684
    // Landscape (95mm x 65mm) -> Aspect Ratio ~ 1.461
    // If round, aspect ratio is 1
    const [aspectRatio, setAspectRatio] = useState(cropShape === 'round' ? 1 : initialAspectRatio);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, { horizontal: false, vertical: false }, cropShape);
            if (croppedImage) {
                onCropComplete(croppedImage);
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleOrientation = () => {
        if (cropShape === 'round') return; // No orientation toggle for round crops
        setAspectRatio((prev) => 1 / prev);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className="relative flex-1 bg-black w-full overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteCallback}
                            onZoomChange={onZoomChange}
                            objectFit="contain"
                            cropShape={cropShape}
                            showGrid={cropShape === 'rect'}
                        />
                    )}
                </div>

                <div className="p-6 space-y-6 bg-background border-t">
                    <div className="flex items-center gap-4">
                        <Label className="w-16">Zoom</Label>
                        <ZoomIn className="w-4 h-4 text-muted-foreground" />
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Label className="w-16">Rotate</Label>
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                        <Slider
                            value={[rotation]}
                            min={0}
                            max={360}
                            step={1}
                            onValueChange={(value) => setRotation(value[0])}
                            className="flex-1"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        {cropShape === 'rect' && (
                            <Button variant="outline" onClick={toggleOrientation} type="button">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {aspectRatio < 1 ? 'Switch to Landscape' : 'Switch to Portrait'}
                            </Button>
                        )}
                        {cropShape === 'round' && <div />} {/* Spacer */}

                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Crop
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
