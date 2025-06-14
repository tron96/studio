
'use server';
/**
 * @fileOverview AI flow for chatting about uploaded contract texts using Genkit and Gemini.
 *
 * - chatWithContracts - A function to handle chat queries about contracts.
 * - ChatWithContractsInput - The input type.
 * - ChatWithContractsOutput - The output type.
 * - Contract - The type for an individual contract.
 */

import { ai } from '@/ai/genkit'; 
import type { z } from 'genkit'; // Import z type for inference
import { 
  ContractSchema, 
  ChatWithContractsInputSchema, 
  ChatWithContractsOutputSchema 
} from '../schemas'; // Import schemas

export type Contract = z.infer<typeof ContractSchema>;
export type ChatWithContractsInput = z.infer<typeof ChatWithContractsInputSchema>;
export type ChatWithContractsOutput = z.infer<typeof ChatWithContractsOutputSchema>;

// Helper function to preprocess input for the prompt
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
  const processedInput = preparePromptInput(input);
  return chatWithContractsFlow(processedInput);
}

const chatPrompt = ai.definePrompt({
  name: 'chatWithContractsPrompt',
  model: 'googleai/gemini-1.5-flash-latest', 
  input: { schema: ChatWithContractsInputSchema }, 
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
[Content for {{this.fileName}}. This is not a PDF. Display content as plain text if available.]
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
    inputSchema: ChatWithContractsInputSchema, 
    outputSchema: ChatWithContractsOutputSchema,
  },
  async (input: ChatWithContractsInput) => { 
    const { output } = await chatPrompt(input); 
    if (!output) {
      throw new Error('Failed to generate chat response, output was null.');
    }
    return output;
  }
);
