'use server';
/**
 * @fileOverview AI-powered product recommendations flow.
 *
 * - getRecommendedProducts - A function that returns a list of recommended products.
 * - RecommendedProductsInput - The input type for the getRecommendedProducts function.
 * - RecommendedProductsOutput - The return type for the getRecommendedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendedProductsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
  category: z.string().describe('The category of the product.'),
  userHistory: z.string().optional().describe('The user purchase history'),
});
export type RecommendedProductsInput = z.infer<typeof RecommendedProductsInputSchema>;

const RecommendedProductsOutputSchema = z.object({
  recommendedProducts: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product.'),
      description: z.string().describe('A short description of the recommended product.'),
      category: z.string().describe('The category of the recommended product.'),
    })
  ).describe('A list of recommended products.'),
});
export type RecommendedProductsOutput = z.infer<typeof RecommendedProductsOutputSchema>;

export async function getRecommendedProducts(input: RecommendedProductsInput): Promise<RecommendedProductsOutput> {
  return getRecommendedProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendedProductsPrompt',
  input: {schema: RecommendedProductsInputSchema},
  output: {schema: RecommendedProductsOutputSchema},
  prompt: `You are a product recommendation expert. Given a product name, description, category and user history, you will recommend a list of related products.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Category: {{{category}}}
User History: {{{userHistory}}}

Based on this information, recommend other products that the user might be interested in. Return a JSON array of objects. Each object should contain the name, description, and category of the recommended product. Limit to 5 products.`,
});

const getRecommendedProductsFlow = ai.defineFlow(
  {
    name: 'getRecommendedProductsFlow',
    inputSchema: RecommendedProductsInputSchema,
    outputSchema: RecommendedProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
