'use server';
/**
 * @fileOverview AI-powered price suggestion tool for trading cards.
 *
 * - suggestCardPrice - A function that suggests a price for a trading card.
 * - SuggestCardPriceInput - The input type for the suggestCardPrice function.
 * - SuggestCardPriceOutput - The return type for the suggestCardPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCardPriceInputSchema = z.object({
  cardName: z.string().describe('The name of the card.'),
  condition: z.string().describe('The condition of the card (e.g., "Near Mint", "PSA 8").'),
  similarListings: z.string().describe('A summary of prices for similar cards.'),
});
export type SuggestCardPriceInput = z.infer<typeof SuggestCardPriceInputSchema>;

const SuggestCardPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price for the card.'),
  priceRange: z.object({
    min: z.number().describe('The minimum reasonable price.'),
    max: z.number().describe('The maximum reasonable price.'),
  }),
  justification: z.string().describe('The reasoning behind the price suggestion.'),
});
export type SuggestCardPriceOutput = z.infer<typeof SuggestCardPriceOutputSchema>;

export async function suggestCardPrice(
  input: SuggestCardPriceInput
): Promise<SuggestCardPriceOutput> {
  return suggestCardPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCardPricePrompt',
  input: {schema: SuggestCardPriceInputSchema},
  output: {schema: SuggestCardPriceOutputSchema},
  prompt: `You are a trading card pricing expert. Based on the card's name, condition, and prices of similar listings, suggest a fair market price.

Card Name: {{{cardName}}}
Condition: {{{condition}}}
Similar Listings: {{{similarListings}}}

Provide a suggested price, a reasonable price range, and a justification for your recommendation.`,
});

const suggestCardPriceFlow = ai.defineFlow(
  {
    name: 'suggestCardPriceFlow',
    inputSchema: SuggestCardPriceInputSchema,
    outputSchema: SuggestCardPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
