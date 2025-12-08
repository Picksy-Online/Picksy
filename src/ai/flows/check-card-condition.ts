'use server';
/**
 * @fileOverview AI-powered trading card condition checker.
 *
 * - checkCardCondition - A function that assesses the condition of a trading card.
 * - CheckCardConditionInput - The input type for the checkCardCondition function.
 * - CheckCardConditionOutput - The return type for the checkCardCondition function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckCardConditionInputSchema = z.object({
  frontImageUri: z
    .string()
    .describe(
      'A photo of the front of the trading card, as a data URI.'
    ),
  backImageUri: z
    .string()
    .describe(
      'A photo of the back of the trading card, as a data URI.'
    ),
});
export type CheckCardConditionInput = z.infer<
  typeof CheckCardConditionInputSchema
>;

const CheckCardConditionOutputSchema = z.object({
  isImageQualitySufficient: z.boolean().describe('Whether the images are clear enough to grade (shows edges, corners, good lighting).'),
  qualityFeedback: z.string().optional().describe('Feedback if the image quality is insufficient (e.g., "Background too cluttered", "Corners cut off").'),
  centering: z.string().optional().describe('An assessment of the card\'s centering.'),
  corners: z.string().optional().describe('An assessment of the card\'s corners.'),
  edges: z.string().optional().describe('An assessment of the card\'s edges.'),
  surface: z.string().optional().describe('An assessment of the card\'s surface.'),
  overallGrade: z.string().optional().describe('An estimated overall grade.'),
  confidence: z.number().min(0).max(1).describe('A score from 0.0 to 1.0 indicating confidence in the grade assessment. Lower confidence if images are blurry, dark, or key areas are hidden.'),
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
  input: { schema: CheckCardConditionInputSchema },
  output: { schema: CheckCardConditionOutputSchema },
  prompt: `You are a professional trading card grader. Analyze the provided images (front and back) of a trading card.

First, assess the image quality. The images might be cropped tightly to the card. This is ACCEPTABLE. Only reject if the card is significantly blurry or major parts are missing. Do not reject simply because there is no background visible.

If the quality is sufficient, set "isImageQualitySufficient" to true and proceed to assess the condition based on: centering, corners, edges, and surface (front and back). Provide an estimated overall grade.

Also provide a "confidence" score (0.0 - 1.0). If the image is perfect, 1.0. If lighting is poor or glare hides details, reduce the score.

Front Image: {{media url=frontImageUri}}
Back Image: {{media url=backImageUri}}`,
});

const checkCardConditionFlow = ai.defineFlow(
  {
    name: 'checkCardConditionFlow',
    inputSchema: CheckCardConditionInputSchema,
    outputSchema: CheckCardConditionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
