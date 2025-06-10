
'use server';
/**
 * @fileOverview AI flow for chatting about uploaded contracts.
 *
 * - chatWithContracts - A function to handle chat queries about contracts.
 * - ChatWithContractsInput - The input type for the chatWithContracts function.
 * - ChatWithContractsOutput - The return type for the chatWithContracts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContractSchema = z.object({
  fileName: z.string().describe('The name of the contract file.'),
  contentDataUri: z
    .string()
    .describe(
      "The contract document in PDF format, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type Contract = z.infer<typeof ContractSchema>;

const ChatWithContractsInputSchema = z.object({
  userQuery: z.string().describe("The user's question about the contracts."),
  contracts: z
    .array(ContractSchema)
    .describe('An array of contract objects to be analyzed.'),
});
export type ChatWithContractsInput = z.infer<typeof ChatWithContractsInputSchema>;

const ChatWithContractsOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated answer to the user query.'),
});
export type ChatWithContractsOutput = z.infer<typeof ChatWithContractsOutputSchema>;

export async function chatWithContracts(input: ChatWithContractsInput): Promise<ChatWithContractsOutput> {
  return chatWithContractsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithContractsPrompt',
  model: 'googleai/gemini-2.0-flash', // Explicitly define model or rely on default from genkit.ts
  input: {schema: ChatWithContractsInputSchema},
  output: {schema: ChatWithContractsOutputSchema},
  config: { // Safety settings are applied here
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }, // Contracts might discuss sensitive but not dangerous topics
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Contracts are unlikely to be explicit
    ]
  },
  prompt: `You are a helpful AI assistant specializing in contract analysis.
You have been provided with the following contract(s). Your task is to answer the user's question based *only* on the information contained within these documents.
If the information is not found in the contracts, state that explicitly. Do not make assumptions or use external knowledge.

{{#if contracts.length}}
Here are the contracts:
{{#each contracts}}
Contract Filename: {{this.fileName}}
Contract Content (this is a PDF document, interpret its content):
{{media url=this.contentDataUri}}
---
{{/each}}
{{else}}
No contracts have been provided. You can inform the user to upload contracts if their question implies they expect you to have some.
{{/if}}

User's Question: {{{userQuery}}}

Please provide a clear and concise answer. If referencing specific details, mention which contract (by filename) contains the information if possible.
`,
});

const chatWithContractsFlow = ai.defineFlow(
  {
    name: 'chatWithContractsFlow',
    inputSchema: ChatWithContractsInputSchema,
    outputSchema: ChatWithContractsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
