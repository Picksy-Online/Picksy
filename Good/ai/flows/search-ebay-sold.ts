'use server';
/**
 * @fileOverview AI-powered search for sold items on eBay.
 *
 * - searchEbaySold - A function that returns a list of recently sold items from eBay.
 * - SearchEbaySoldInput - The input type for the searchEbaySold function.
 * - SearchEbaySoldOutput - The return type for the searchEbaySold function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchEbaySoldInputSchema = z.object({
  cardName: z.string().describe('The name of the collector card to search for.'),
});
export type SearchEbaySoldInput = z.infer<typeof SearchEbaySoldInputSchema>;

const EbayListingSchema = z.object({
  title: z.string().describe('The title of the eBay listing.'),
  price: z.string().describe('The final sale price of the item.'),
  date: z.string().describe('The date the item was sold.'),
  url: z.string().url().describe('The URL of the listing.'),
});

const SearchEbaySoldOutputSchema = z.object({
  soldListings: z.array(EbayListingSchema).describe('A list of recently sold eBay listings for the specified card.'),
});
export type SearchEbaySoldOutput = z.infer<typeof SearchEbaySoldOutputSchema>;

export async function searchEbaySold(input: SearchEbaySoldInput): Promise<SearchEbaySoldOutput> {
  return searchEbaySoldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchEbaySoldPrompt',
  input: {schema: SearchEbaySoldInputSchema},
  output: {schema: SearchEbaySoldOutputSchema},
  prompt: `You are an eBay market data expert for collector cards. Your task is to find the 5 most recent "sold" listings on eBay for a given collector card.

Card Name: {{{cardName}}}

Please provide a list of 5 simulated sold listings. For each listing, include the title, the final price (in USD, with a dollar sign), the date it was sold (e.g., "May 20, 2024"), and a plausible but fake eBay URL.`,
});

const searchEbaySoldFlow = ai.defineFlow(
  {
    name: 'searchEbaySoldFlow',
    inputSchema: SearchEbaySoldInputSchema,
    outputSchema: SearchEbaySoldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
