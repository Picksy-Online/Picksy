'use server';

import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { Product } from '@prisma/client';

export type CreateListingInput = {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[]; // Base64 strings
    condition?: string; // Stored in description or a new field if we had one, putting in description for now
    year?: number;
    imageHint?: string; // To store front/back metadata if needed

    // New Fields
    denomination?: string;
    country?: string;
    isGraded?: boolean;
    gradingCompany?: string;
    grade?: string;
    certNumber?: string;
};

export type CreateListingResult = {
    success: boolean;
    product?: Product;
    error?: string;
};

export async function createListing(input: CreateListingInput): Promise<CreateListingResult> {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: 'You must be logged in to create a listing.' };
        }

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            return { success: false, error: 'User email not found.' };
        }

        // Ensure user exists in our DB (sync if needed, though usually handled by webhook/syncUser)
        // For safety, we just look them up.
        let dbUser = await db.user.findUnique({
            where: { id: user.id },
        });

        // Fallback: simple sync if missing (good for dev robustness)
        import { uploadToS3 } from '@/lib/s3';

        // ... existing code ...

        // Fallback: simple sync if missing (good for dev robustness)
        if (!dbUser) {
            dbUser = await db.user.create({
                data: {
                    id: user.id,
                    email: email,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    avatarUrl: user.imageUrl,
                    role: 'USER',
                }
            });
        }

        // Process images: Upload to S3 if they are Base64
        const imageUrls: string[] = [];
        for (const img of input.images) {
            try {
                if (img.startsWith('data:')) {
                    const url = await uploadToS3(img, 'listings');
                    imageUrls.push(url);
                } else {
                    imageUrls.push(img); // Already a URL
                }
            } catch (err) {
                console.error('Failed to upload image to S3', err);
                // Fallback: Keep base64 if upload fails? Or skip?
                // Let's keep base64 as fallback so listing isn't broken, 
                // but usually we'd want to fail or retry.
                imageUrls.push(img);
            }
        }

        // Create the product
        const product = await db.product.create({
            data: {
                name: input.name,
                description: input.description, // We can append condition here
                price: input.price,
                category: input.category,
                imageUrls: JSON.stringify(imageUrls),
                year: input.year,
                sellerId: dbUser.id,
                imageHint: input.imageHint,

                // New Fields
                denomination: input.denomination,
                country: input.country,
                isGraded: input.isGraded,
                gradingCompany: input.gradingCompany,
                grade: input.grade,
                certNumber: input.certNumber,
            },
        });

        return { success: true, product };

    } catch (error) {
        console.error('Error creating listing:', error);
        return { success: false, error: 'Failed to create listing in database.' };
    }
}
