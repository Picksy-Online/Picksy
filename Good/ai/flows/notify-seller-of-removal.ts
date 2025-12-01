
'use server';
/**
 * @fileOverview Flow to notify a seller that their product has been removed.
 *
 * - notifySellerOfRemoval - A function that simulates sending an email to a seller.
 * - NotifySellerInput - The input type for the function.
 * - NotifySellerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotifySellerInputSchema = z.object({
  sellerEmail: z.string().email().describe('The email address of the seller to notify.'),
  sellerName: z.string().describe('The name of the seller.'),
  productName: z.string().describe('The name of the product that was removed.'),
});
export type NotifySellerInput = z.infer<typeof NotifySellerInputSchema>;

const NotifySellerOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was sent successfully.'),
  message: z.string().describe('A summary of the action taken.'),
});
export type NotifySellerOutput = z.infer<typeof NotifySellerOutputSchema>;

export async function notifySellerOfRemoval(input: NotifySellerInput): Promise<NotifySellerOutput> {
  return notifySellerOfRemovalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'notifySellerPrompt',
  input: {schema: NotifySellerInputSchema},
  prompt: `Generate a professional and courteous email to a seller informing them that their product has been removed for violating the platform's terms and conditions.

Seller Name: {{{sellerName}}}
Product Name: {{{productName}}}
Seller Email: {{{sellerEmail}}}

The email should:
1. State clearly that the product "{{{productName}}}" has been removed.
2. Mention that the removal is due to a violation of the platform's Terms and Conditions.
3. Direct the seller to review the T&Cs for more information.
4. Be polite and professional in tone.`,
});

const notifySellerOfRemovalFlow = ai.defineFlow(
  {
    name: 'notifySellerOfRemovalFlow',
    inputSchema: NotifySellerInputSchema,
    outputSchema: NotifySellerOutputSchema,
  },
  async (input) => {
    const {text} = await prompt(input);

    // In a real application, you would use an email service (like SendGrid, Nodemailer, etc.)
    // to send the generated email content.
    console.log('--- SIMULATING EMAIL ---');
    console.log(`To: ${input.sellerEmail}`);
    console.log(`Subject: Important Notification Regarding Your Product: "${input.productName}"`);
    console.log('--- Email Body ---');
    console.log(text);
    console.log('------------------------');

    return {
      success: true,
      message: `Simulated an email notification to ${input.sellerEmail} regarding the removal of "${input.productName}".`,
    };
  }
);
