'use server';
/**
 * @fileOverview AI-powered visual search for finding similar products.
 *
 * - findSimilarProducts - A function that returns visually similar products.
 * - FindSimilarProductsInput - The input type for the findSimilarProducts function.
 * - FindSimilarProductsOutput - The return type for the findSimilarProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSimilarProductsInputSchema = z.object({
  productImageUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
  category: z.string().optional().describe('The category to search within.'),
});
export type FindSimilarProductsInput = z.infer<
  typeof FindSimilarProductsInputSchema
>;

const FindSimilarProductsOutputSchema = z.object({
  similarProducts: z.array(
    z.object({
      productId: z.string().describe('The ID of the similar product.'),
      productName: z.string().describe('The name of the similar product.'),
      similarityScore: z
        .number()
        .describe('A score indicating how similar the product is (0-1).'),
    })
  ),
});
export type FindSimilarProductsOutput = z.infer<
  typeof FindSimilarProductsOutputSchema
>;

export async function findSimilarProducts(
  input: FindSimilarProductsInput
): Promise<FindSimilarProductsOutput> {
  // In a real implementation, this would query a vector database.
  // For now, we'll simulate a response.
  return findSimilarProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSimilarProductsPrompt',
  input: {schema: FindSimilarProductsInputSchema},
  output: {schema: FindSimilarProductsOutputSchema},
  prompt: `You are a visual search engine for an e-commerce marketplace. Find products that are visually similar to the provided image.

Product Image: {{media url=productImageUri}}
{{#if category}}
Category: {{{category}}}
{{/if}}

Return a list of similar product IDs and names, along with a similarity score. For this simulation, just return a plausible but fake list.`,
});


const findSimilarProductsFlow = ai.defineFlow(
  {
    name: 'findSimilarProductsFlow',
    inputSchema: FindSimilarProductsInputSchema,
    outputSchema: FindSimilarProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
