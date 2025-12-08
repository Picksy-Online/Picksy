'use server';
/**
 * @fileOverview AI-powered trading card identification.
 *
 * - identifyCard - A function that extracts details from a trading card image.
 * - IdentifyCardInput - The input type for the identifyCard function.
 * - IdentifyCardOutput - The return type for the identifyCard function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyCardInputSchema = z.object({
    frontImageUri: z
        .string()
        .describe(
            'A photo of the front of the trading card, as a data URI.'
        ),
    backImageUri: z
        .string()
        .optional()
        .describe(
            'A photo of the back of the trading card, as a data URI.'
        ),
});
export type IdentifyCardInput = z.infer<
    typeof IdentifyCardInputSchema
>;

const IdentifyCardOutputSchema = z.object({
    cardName: z.string().describe('The name of the card (e.g., "Charizard", "Michael Jordan").'),
    year: z.string().optional().describe('The year printed on the card or the release year of the set.'),
    set: z.string().optional().describe('The name of the set the card belongs to.'),
    cardNumber: z.string().optional().describe('The card number within the set.'),
    manufacturer: z.string().optional().describe('The manufacturer of the card (e.g., "Wizards of the Coast", "Topps").'),
    details: z.string().optional().describe('Any other relevant details visible on the card.'),
});
export type IdentifyCardOutput = z.infer<
    typeof IdentifyCardOutputSchema
>;

export async function identifyCard(
    input: IdentifyCardInput
): Promise<IdentifyCardOutput> {
    return identifyCardFlow(input);
}

const prompt = ai.definePrompt({
    name: 'identifyCardPrompt',
    input: { schema: IdentifyCardInputSchema },
    output: { schema: IdentifyCardOutputSchema },
    prompt: `You are an expert trading card identifier. Analyze the provided images (front and optionally back) of a trading card and extract the following details:
- Card Name
- Year (Look for copyright dates or set years)
- Set Name
- Card Number
- Manufacturer

Front Image: {{media url=frontImageUri}}
{{#if backImageUri}}
Back Image: {{media url=backImageUri}}
{{/if}}`,
});

const identifyCardFlow = ai.defineFlow(
    {
        name: 'identifyCardFlow',
        inputSchema: IdentifyCardInputSchema,
        outputSchema: IdentifyCardOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
