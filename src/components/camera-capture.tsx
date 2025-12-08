'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Camera, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ARCameraOverlay } from './camera/ar-camera-overlay';

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void;
    onClose?: () => void;
    className?: string;
    mode?: 'single' | 'binder';
    onModeChange?: (mode: 'single' | 'binder') => void;
}

export function CameraCapture({ onCapture, onClose, className, mode: propMode, onModeChange }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mode State (Internal if not controlled)
    const [internalMode, setInternalMode] = useState<'single' | 'binder'>('single');
    const activeMode = propMode || internalMode;

    const toggleMode = () => {
        const newMode = activeMode === 'single' ? 'binder' : 'single';
        if (onModeChange) {
            onModeChange(newMode);
        } else {
            setInternalMode(newMode);
        }
    };

    // Polish States
    const [flashActive, setFlashActive] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [maxZoom, setMaxZoom] = useState(1);
    const [supportsTorch, setSupportsTorch] = useState(false);
    const [torchActive, setTorchActive] = useState(false);
    const [showFocusReticle, setShowFocusReticle] = useState(false);
    const [focusPosition, setFocusPosition] = useState({ x: 50, y: 50 });



    const startCamera = useCallback(async () => {
        setIsStreaming(false);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasPermission(false);
            setError('Camera API not supported in this browser.');
            return;
        }

        try {
            // Stop existing tracks
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 4096 }, // Request 4K
                    height: { ideal: 2160 },
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setHasPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setIsStreaming(true);
                    videoRef.current?.play().catch(e => console.error("Error playing video:", e));
                };
            }

            // Check capabilities
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            // @ts-ignore
            if (capabilities.zoom) {
                // @ts-ignore
                setMaxZoom(capabilities.zoom.max || 1);
            }

            // @ts-ignore
            if (capabilities.torch) {
                setSupportsTorch(true);
            }

            // Continuous focus
            // @ts-ignore
            if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                try {
                    // @ts-ignore
                    await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                } catch (e) {
                    console.warn("Could not set continuous focus", e);
                }
            }

        } catch (err) {
            console.error('Error accessing camera:', err);
            setHasPermission(false);
            setError('Could not access camera. Please check permissions.');
        }
    }, [facingMode]);

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    const playShutterSound = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio context error", e);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            // Flash effect
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 150);

            // Sound effect
            playShutterSound();

            // Show processing state
            setIsProcessing(true);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                // Delay to show scan effect
                setTimeout(() => {
                    onCapture(dataUrl);
                    setIsProcessing(false);
                }, 800);
            }
        }
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        setZoom(1); // Reset zoom on switch
    };

    const handleZoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoom = parseFloat(e.target.value);
        setZoom(newZoom);

        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            try {
                // @ts-ignore
                await track.applyConstraints({ advanced: [{ zoom: newZoom }] });
            } catch (err) {
                console.error("Zoom failed", err);
            }
        }
    };

    const toggleTorch = async () => {
        if (!supportsTorch || !videoRef.current || !videoRef.current.srcObject) return;

        const stream = videoRef.current.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        const newTorchState = !torchActive;

        try {
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ torch: newTorchState }] });
            setTorchActive(newTorchState);
        } catch (err) {
            console.error("Torch failed", err);
        }
    };

    const handleTapToFocus = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || !videoRef.current.srcObject) return;

        // Calculate click position for visual feedback
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setFocusPosition({ x, y });
        setShowFocusReticle(true);
        setTimeout(() => setShowFocusReticle(false), 1000);

        const stream = videoRef.current.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        // @ts-ignore
        if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
            try {
                // @ts-ignore
                await track.applyConstraints({ advanced: [{ focusMode: 'manual' }] });
                setTimeout(async () => {
                    // @ts-ignore
                    await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                }, 200);
            } catch (e) {
                // Ignore errors
            }
        }
    };

    return (
        <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
            <canvas ref={canvasRef} className="hidden" />

            {/* Flash Overlay */}
            <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150 ${flashActive ? 'opacity-100' : 'opacity-0'}`} />

            {/* Video Feed */}
            <div
                className="relative w-full h-full bg-black flex items-center justify-center cursor-crosshair"
                onClick={handleTapToFocus}
            >
                {!isStreaming && !error && (
                    <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}

                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${!isStreaming ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    autoPlay
                    muted
                    playsInline
                />

                {/* AR Overlay */}
                <ARCameraOverlay isActive={isStreaming} isProcessing={isProcessing} mode={activeMode} />

                {/* Focus Reticle */}
                {showFocusReticle && (
                    <div
                        className="absolute w-16 h-16 border-2 border-yellow-400 rounded-full transition-all duration-200 ease-out transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-50"
                        style={{ left: `${focusPosition.x}%`, top: `${focusPosition.y}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                )}
            </div>

            {/* Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-4 z-20 transition-opacity duration-300 ${isProcessing ? 'opacity-0' : 'opacity-100'}`}>

                {/* Zoom Slider */}
                {maxZoom > 1 && (
                    <div className="flex items-center justify-center gap-4 px-8">
                        <span className="text-xs text-white font-medium">1x</span>
                        <input
                            type="range"
                            min="1"
                            max={Math.min(maxZoom, 5)} // Cap at 5x for UI usability
                            step="0.1"
                            value={zoom}
                            onChange={handleZoomChange}
                            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <span className="text-xs text-white font-medium">{zoom.toFixed(1)}x</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    {supportsTorch ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`text-white hover:bg-white/20 ${torchActive ? 'bg-yellow-400/20 text-yellow-400' : ''}`}
                            onClick={toggleTorch}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        </Button>
                    ) : (
                        <div className="w-10"></div> // Spacer
                    )}

                    <Button
                        size="lg"
                        className="rounded-full w-20 h-20 border-4 border-white bg-transparent hover:bg-white/10 p-1 transition-all active:scale-95"
                        onClick={handleCapture}
                        disabled={!isStreaming || isProcessing}
                    >
                        <div className="w-full h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                    </Button>

                    {/* Mode Toggle & Camera Switch */}
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={toggleCamera}
                        >
                            <RefreshCcw className="w-6 h-6" />
                        </Button>
                        {/* Mode Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={toggleMode}
                        >
                            {/* Simple Icon for Grid vs Single */}
                            {activeMode === 'single' ? (
                                <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                </div>
                            ) : (
                                <div className="w-6 h-6 grid grid-cols-2 gap-0.5 p-1 border-2 border-white rounded-md">
                                    <div className="bg-white/80 rounded-[1px]" />
                                    <div className="bg-white/80 rounded-[1px]" />
                                    <div className="bg-white/80 rounded-[1px]" />
                                    <div className="bg-white/80 rounded-[1px]" />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Close Button */}
            {onClose && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-black/40 z-30 rounded-full"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-6 z-30">
                    <Alert variant="destructive">
                        <AlertTitle>Camera Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        <Button variant="outline" className="mt-4 w-full" onClick={startCamera}>Retry</Button>
                    </Alert>
                </div>
            )}
        </div>
    );
}
