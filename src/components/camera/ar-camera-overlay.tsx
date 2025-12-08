'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Scan } from 'lucide-react';

interface ARCameraOverlayProps {
    isActive: boolean;
    className?: string;
    isProcessing?: boolean;
    mode?: 'single' | 'binder';
}

export function ARCameraOverlay({ isActive, className, isProcessing, mode = 'single' }: ARCameraOverlayProps) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
            {/* Darkened Background with Clear Cutout */}
            <div className="absolute inset-0 bg-black/60">

                {/* Single Card Mode */}
                {mode === 'single' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-[1/1.43] bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-xl border-2 border-white/30">
                        {/* Corner Guides */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

                        {/* Scanning Animation */}
                        {(isActive || isProcessing) && (
                            <div className="absolute inset-0 overflow-hidden rounded-lg">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/80 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_linear_infinite]" />
                            </div>
                        )}

                        {/* Center Reticle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Scan className="w-12 h-12 text-white/20" />
                        </div>
                    </div>
                )}

                {/* Binder Mode (3x3 Grid) */}
                {mode === 'binder' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-[3/4] bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] border-2 border-white/30">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/10 relative">
                                    {/* Mini Corners for each cell */}
                                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/20" />
                                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/20" />
                                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/20" />
                                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/20" />
                                </div>
                            ))}
                        </div>

                        {/* Binder Scanning Animation */}
                        {(isActive || isProcessing) && (
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-[scan_3s_linear_infinite]" />
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Instructions */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
                <p className="text-white font-medium text-lg drop-shadow-md bg-black/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                    {isProcessing ? "Processing Page..." : mode === 'binder' ? "Align full binder page" : "Align card within frame"}
                </p>
            </div>

            <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
