
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Remove data URL prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Load image
        const originalImage = sharp(imageBuffer);
        const metadata = await originalImage.metadata();

        if (!metadata.width || !metadata.height) {
            return NextResponse.json({ error: 'Invalid image' }, { status: 400 });
        }

        const { width, height } = metadata;

        // Calculate cell dimensions (3x3 grid)
        // We assume the user has aligned the binder page reasonably well per the AR overlay
        const cellWidth = Math.floor(width / 3);
        const cellHeight = Math.floor(height / 3);

        const cards: string[] = [];

        // Slice into 9 parts
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const left = c * cellWidth;
                const top = r * cellHeight;

                // Extract and resize/process if needed (e.g. keeping it high quality)
                const buffer = await originalImage
                    .clone()
                    .extract({ left, top, width: cellWidth, height: cellHeight })
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const base64Card = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                cards.push(base64Card);
            }
        }

        return NextResponse.json({ cards });

    } catch (error) {
        console.error('Error slicing binder page:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
