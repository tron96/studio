
'use server';
/**
 * @fileOverview Summarizes contract text using Genkit and Gemini.
 *
 * - summarizeContract - A function that handles the contract summarization process.
 * - SummarizeContractInput - The input type for the summarizeContract function.
 * - SummarizeContractOutput - The return type for the summarizeContract function.
 */

import { ai } from '@/ai/genkit'; // Import the configured AI instance
import { z } from 'genkit'; 

// Define Zod schema for input (not exported)
const SummarizeContractInputSchema = z.object({
  contractDataUri: z.string().describe(
    "The contract content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type SummarizeContractInput = z.infer<typeof SummarizeContractInputSchema>;

// Define Zod schema for output (not exported)
const SummarizeContractOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the contract.'),
});
export type SummarizeContractOutput = z.infer<typeof SummarizeContractOutputSchema>;

export async function summarizeContract(
  input: SummarizeContractInput
): Promise<SummarizeContractOutput> {
  return summarizeContractFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizeContractPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Specify Gemini model
  input: { schema: SummarizeContractInputSchema },
  output: { schema: SummarizeContractOutputSchema },
  prompt: `You are an expert legal contract summarizer.
Please provide a concise summary of the key terms of the following contract, including but not limited to: pricing, delivery terms, duration, and the parties involved.

Contract Content:
{{media url=contractDataUri}}

Summary:`,
});

const summarizeContractFlow = ai.defineFlow(
  {
    name: 'summarizeContractFlow',
    inputSchema: SummarizeContractInputSchema,
    outputSchema: SummarizeContractOutputSchema,
  },
  async (input) => {
    const { output } = await summarizePrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary, output was null.');
    }
    return output;
  }
);
