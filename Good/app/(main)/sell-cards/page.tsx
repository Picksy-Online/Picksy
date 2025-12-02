
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
  RectangleHorizontal,
  RectangleVertical,
  Wand2
} from 'lucide-react';
import { checkCardCondition, CheckCardConditionOutput } from '@/ai/flows/check-card-condition';
import { findSimilarProducts, FindSimilarProductsOutput } from '@/ai/flows/visual-search';
import { suggestCardPrice, SuggestCardPriceOutput } from '@/ai/flows/suggest-price';
import { generateCardDescription, GenerateCardDescriptionOutput } from '@/ai/flows/generate-description';
import { products } from '@/lib/data';
import { cn } from '@/lib/utils';

declare global {
    var cv: any;
}

type AnalysisState = {
  condition?: CheckCardConditionOutput;
  similar?: FindSimilarProductsOutput;
  price?: SuggestCardPriceOutput;
  description?: GenerateCardDescriptionOutput;
};

type OverlayMode = 'portrait' | 'landscape';

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
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('portrait');
  const [isOpenCvReady, setIsOpenCvReady] = useState(false);
  const [isAutoEnhance, setIsAutoEnhance] = useState(true);

  useEffect(() => {
    if (window.cv) {
      setIsOpenCvReady(true);
    } else {
      const script = document.querySelector('script[src*="opencv.js"]');
      script?.addEventListener('load', () => setIsOpenCvReady(true));
    }
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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

  const processImage = (src: any) => {
    const img = src;
    let gray = new window.cv.Mat();
    window.cv.cvtColor(img, gray, window.cv.COLOR_RGBA2GRAY, 0);
    let blurred = new window.cv.Mat();
    window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0, 0, window.cv.BORDER_DEFAULT);
    let edged = new window.cv.Mat();
    window.cv.Canny(blurred, edged, 75, 200);

    let contours = new window.cv.MatVector();
    let hierarchy = new window.cv.Mat();
    window.cv.findContours(edged, contours, hierarchy, window.cv.RETR_LIST, window.cv.CHAIN_APPROX_SIMPLE);

    let largestContour;
    let maxArea = 0;
    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let area = window.cv.contourArea(cnt, false);
        if (area > maxArea) {
            maxArea = area;
            largestContour = cnt;
        }
    }

    if (largestContour) {
        let perimeter = window.cv.arcLength(largestContour, true);
        let approx = new window.cv.Mat();
        window.cv.approxPolyDP(largestContour, approx, 0.02 * perimeter, true);

        if (approx.rows === 4) {
            const corners = [];
            for (let i = 0; i < approx.rows; i++) {
                corners.push({ x: approx.data32S[i * 2], y: approx.data32S[i * 2 + 1] });
            }

            corners.sort((a, b) => a.y - b.y);
            const topCorners = corners.slice(0, 2).sort((a, b) => a.x - b.x);
            const bottomCorners = corners.slice(2, 4).sort((a, b) => a.x - b.x);
            const [tl, tr] = topCorners;
            const [bl, br] = bottomCorners;
            
            let widthA = Math.sqrt(Math.pow(br.x - bl.x, 2) + Math.pow(br.y - bl.y, 2));
            let widthB = Math.sqrt(Math.pow(tr.x - tl.x, 2) + Math.pow(tr.y - tl.y, 2));
            let maxWidth = Math.max(widthA, widthB);

            let heightA = Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2));
            let heightB = Math.sqrt(Math.pow(tl.x - bl.x, 2) + Math.pow(tl.y - bl.y, 2));
            let maxHeight = Math.max(heightA, heightB);

            let srcTri = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
            let dstTri = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [0, 0, maxWidth, 0, maxWidth, maxHeight, 0, maxHeight]);
            let M = window.cv.getPerspectiveTransform(srcTri, dstTri);
            let dsize = new window.cv.Size(maxWidth, maxHeight);
            let warped = new window.cv.Mat();
            window.cv.warpPerspective(img, warped, M, dsize, window.cv.INTER_LINEAR, window.cv.BORDER_CONSTANT, new window.cv.Scalar());
            
            return warped;
        }
    }
    return img;
};


  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (isAutoEnhance && isOpenCvReady) {
            try {
              let src = window.cv.imread(canvas);
              const result = processImage(src);
              window.cv.imshow(canvas, result);
              src.delete();
              result.delete();
            } catch (error) {
                console.error("OpenCV processing error: ", error)
                toast({
                    variant: 'destructive',
                    title: 'Image Processing Failed',
                    description: 'Could not auto-enhance the image. Try capturing again.',
                });
            }
        }
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

  const toggleOverlayMode = () => {
    setOverlayMode(prev => prev === 'portrait' ? 'landscape' : 'portrait');
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera />
                <span>Capture Card Image</span>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm' onClick={() => setIsAutoEnhance(!isAutoEnhance)} disabled={!isOpenCvReady} className={cn(isAutoEnhance && 'bg-primary/20')}>
                    <Wand2 className='mr-2 h-4 w-4'/>
                    {isAutoEnhance ? 'Auto-Enhance ON' : 'Auto-Enhance OFF'}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleOverlayMode} title="Toggle Orientation">
                    {overlayMode === 'portrait' ? <RectangleHorizontal /> : <RectangleVertical />}
                </Button>
              </div>
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
               {!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                    <div className={cn(
                        "border-4 border-white/50 rounded-xl bg-black/20",
                        overlayMode === 'portrait' ? "w-full aspect-[1/1.4]" : "h-full aspect-[1.4/1]"
                    )} />
                </div>
              )}
            </div>

            {hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Not Available</AlertTitle>
                <AlertDescription>
                  Camera access is required. Please check your browser settings and refresh the page.
                </AlertDescription>
              </Alert>
            )}
            {!isOpenCvReady && (
                 <Alert variant="default" className="mt-4">
                    <AlertTitle>Initializing Image Tools</AlertTitle>
                    <AlertDescription>
                    Please wait a moment while we prepare the image enhancement tools.
                    </Aler