'use server';
/**
 * @fileOverview AI-powered trading card condition checker.
 *
 * - checkCardCondition - A function that assesses the condition of a trading card.
 * - CheckCardConditionInput - The input type for the checkCardCondition function.
 * - CheckCardConditionOutput - The return type for the checkCardCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckCardConditionInputSchema = z.object({
  cardImageUri: z
    .string()
    .describe(
      'A photo of the trading card, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type CheckCardConditionInput = z.infer<
  typeof CheckCardConditionInputSchema
>;

const CheckCardConditionOutputSchema = z.object({
  centering: z
    .string()
    .describe('An assessment of the card\'s centering (e.g., "55/45 L/R").'),
  corners: z.string().describe('An assessment of the card\'s corners.'),
  edges: z.string().describe('An assessment of the card\'s edges.'),
  surface: z.string().describe('An assessment of the card\'s surface.'),
  overallGrade: z
    .string()
    .describe('An estimated overall grade (e.g., "PSA 8" or "Near Mint").'),
});
export type CheckCardConditionOutput = z.infer<
  typeof CheckCardConditionOutputSchema
>;

export async function checkCardCondition(
  input: CheckCardConditionInput
): Promise<CheckCardConditionOutput> {
  return checkCardConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkCardConditionPrompt',
  input: {schema: CheckCardConditionInputSchema},
  output: {schema: CheckCardConditionOutputSchema},
  prompt: `You are a professional trading card grader. Analyze the provided image of a trading card and assess its condition based on the following criteria: centering, corners, edges, and surface. Provide an estimated overall grade.

Card Image: {{media url=cardImageUri}}`,
});

const checkCardConditionFlow = ai.defineFlow(
  {
    name: 'checkCardConditionFlow',
    inputSchema: CheckCardConditionInputSchema,
    outputSchema: CheckCardConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
