'use server';
/**
 * @fileOverview AI flow for chatting about uploaded contract texts using Genkit and Gemini.
 *
 * - chatWithContracts - A function to handle chat queries about contracts.
 * - ChatWithContractsInputSchema - Zod schema for input.
 * - ChatWithContractsOutputSchema - Zod schema for output.
 * - ContractSchema - Zod schema for individual contract details.
 * - ChatWithContractsInput - The input type.
 * - ChatWithContractsOutput - The output type.
 * - Contract - The type for an individual contract.
 */

import { ai } from '@/ai/genkit'; // Import the configured AI instance
import { z } from 'genkit/zod';

export const ContractSchema = z.object({
  fileName: z.string().describe('The name of the contract file.'),
  contentDataUri: z.string().describe(
    "The contract content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  isPdf: z.boolean().optional().describe('Indicates if the contract is a PDF (for prompt logic).')
});
export type Contract = z.infer<typeof ContractSchema>;

export const ChatWithContractsInputSchema = z.object({
  userQuery: z.string().describe("The user's question about the contracts."),
  contracts: z.array(ContractSchema).describe('An array of contracts to chat about.'),
});
export type ChatWithContractsInput = z.infer<typeof ChatWithContractsInputSchema>;

export const ChatWithContractsOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user query.'),
});
export type ChatWithContractsOutput = z.infer<typeof ChatWithContractsOutputSchema>;

// Helper function to preprocess input for the prompt, e.g., determine if content is PDF
function preparePromptInput(input: ChatWithContractsInput): ChatWithContractsInput {
    const processedContracts = input.contracts.map(contract => ({
        ...contract,
        isPdf: contract.contentDataUri.startsWith('data:application/pdf'),
    }));
    return { ...input, contracts: processedContracts };
}

export async function chatWithContracts(
  input: ChatWithContractsInput
): Promise<ChatWithContractsOutput> {
  const processedInput = preparePromptInput(input); // Preprocess input before calling the flow
  return chatWithContractsFlow(processedInput);
}

const chatPrompt = ai.definePrompt({
  name: 'chatWithContractsPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Explicitly Gemini
  input: { schema: ChatWithContractsInputSchema }, // Schema for the (processed) input to the prompt
  output: { schema: ChatWithContractsOutputSchema },
  prompt: `You are a helpful AI assistant specializing in contract analysis.
You have been provided with the following contract(s). Your task is to answer the user's question based *only* on the information contained within these documents.
If the information is not found in the contracts, state that explicitly. Do not make assumptions or use external knowledge.

{{#if contracts.length}}
Here are the contracts:
{{#each contracts}}
Contract Filename: {{this.fileName}}
Contract Content:
{{#if this.isPdf}}
{{media url=this.contentDataUri}}
{{else}}
[Non-PDF content for {{this.fileName}}. Ensure textual representation is provided if this is not an image/PDF.]
{{/if}}
---
{{/each}}
{{else}}
No contracts have been provided. You can inform the user to upload contracts if their question implies they expect you to have some.
{{/if}}

User's Question: {{userQuery}}

AI Response:`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

const chatWithContractsFlow = ai.defineFlow(
  {
    name: 'chatWithContractsFlow',
    inputSchema: ChatWithContractsInputSchema, // Flow expects the processed input structure
    outputSchema: ChatWithContractsOutputSchema,
  },
  async (input) => { // This input is already processed by the wrapper function
    const { output } = await chatPrompt(input);
    if (!output) {
      throw new Error('Failed to generate chat response, output was null.');
    }
    return output;
  }
);
