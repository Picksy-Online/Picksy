'use server';
/**
 * @fileOverview AI-powered product description generator for trading cards.
 *
 * - generateCardDescription - A function that creates a description for a trading card.
 * - GenerateCardDescriptionInput - The input type for the generateCardDescription function.
 * - GenerateCardDescriptionOutput - The return type for the generateCardDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCardDescriptionInputSchema = z.object({
  cardName: z.string().describe('The name of the card.'),
  cardDetails: z.string().describe('Any known details about the card (e.g., year, set, player).'),
  conditionReport: z.string().describe('The condition report from the grading tool.'),
});
export type GenerateCardDescriptionInput = z.infer<
  typeof GenerateCardDescriptionInputSchema
>;

const GenerateCardDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling product description for the card.'),
});
export type GenerateCardDescriptionOutput = z.infer<
  typeof GenerateCardDescriptionOutputSchema
>;

export async function generateCardDescription(
  input: GenerateCardDescriptionInput
): Promise<GenerateCardDescriptionOutput> {
  return generateCardDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCardDescriptionPrompt',
  input: {schema: GenerateCardDescriptionInputSchema},
  output: {schema: GenerateCardDescriptionOutputSchema},
  prompt: `You are an expert copywriter for a marketplace specializing in trading cards. Generate a compelling product description based on the provided card information.

Card Name: {{{cardName}}}
Card Details: {{{cardDetails}}}
Condition Report: {{{conditionReport}}}

Highlight the key features and condition to attract buyers.`,
});

const generateCardDescriptionFlow = ai.defineFlow(
  {
    name: 'generateCardDescriptionFlow',
    inputSchema: GenerateCardDescriptionInputSchema,
    outputSchema: GenerateCardDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
