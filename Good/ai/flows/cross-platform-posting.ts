'use server';
/**
 * @fileOverview AI-powered cross-platform posting flow.
 *
 * - crossPlatformPost - A function that returns an optimized listing for a given marketplace.
 * - CrossPlatformPostInput - The input type for the crossPlatformPost function.
 * - CrossPlatformPostOutput - The return type for the crossPlatformPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrossPlatformPostInputSchema = z.object({
  productDescription: z.string().describe('The original product description.'),
  marketplace: z.string().describe('The target marketplace (e.g., "eBay", "Etsy").'),
  currentListing: z.string().describe('The current listing details (e.g., title, price).'),
});
export type CrossPlatformPostInput = z.infer<typeof CrossPlatformPostInputSchema>;

const CrossPlatformPostOutputSchema = z.object({
  optimizedListing: z.string().describe('The AI-optimized product description for the target marketplace.'),
  tags: z.array(z.string()).optional().describe('A list of suggested tags or keywords for the listing.'),
});
export type CrossPlatformPostOutput = z.infer<typeof CrossPlatformPostOutputSchema>;


export async function crossPlatformPost(input: CrossPlatformPostInput): Promise<CrossPlatformPostOutput> {
  return crossPlatformPostFlow(input);
}


const prompt = ai.definePrompt({
  name: 'crossPlatformPostPrompt',
  input: {schema: CrossPlatformPostInputSchema},
  output: {schema: CrossPlatformPostOutputSchema},
  prompt: `You are an e-commerce expert specializing in optimizing product listings for different marketplaces.
Given a product description and a target marketplace, rewrite the listing to be more effective for that platform.

Original Listing Details:
{{{currentListing}}}

Original Description:
{{{productDescription}}}

Target Marketplace: {{{marketplace}}}

Optimize the description and provide relevant tags to maximize visibility and sales on the specified marketplace.
Return the result in JSON format.`,
});


const crossPlatformPostFlow = ai.defineFlow(
  {
    name: 'crossPlatformPostFlow',
    inputSchema: CrossPlatformPostInputSchema,
    outputSchema: CrossPlatformPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
