
'use server';
/**
 * @fileOverview Summarizes contract text using Genkit and Gemini.
 *
 * - summarizeContract - A function that handles the contract summarization process.
 * - SummarizeContractInput - The input type for the summarizeContract function.
 * - SummarizeContractOutput - The return type for the summarizeContract function.
 */

import { ai } from '@/ai/genkit'; 
import type { z } from 'genkit'; // Import z type for inference
import { 
  SummarizeContractInputSchema, 
  SummarizeContractOutputSchema 
} from '../schemas'; // Import schemas

export type SummarizeContractInput = z.infer<typeof SummarizeContractInputSchema>;
export type SummarizeContractOutput = z.infer<typeof SummarizeContractOutputSchema>;

export async function summarizeContract(
  input: SummarizeContractInput
): Promise<SummarizeContractOutput> {
  return summarizeContractFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizeContractPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
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
  async (input: SummarizeContractInput) => {
    const { output } = await summarizePrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary, output was null.');
    }
    return output;
  }
);
