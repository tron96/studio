/**
 * @fileOverview Zod schemas for AI flows. This file does not use 'use server'.
 */
import { z } from 'genkit';

// Schemas for chat-with-contracts-flow
export const ContractSchema = z.object({
  fileName: z.string().describe('The name of the contract file.'),
  contentDataUri: z.string().describe(
    "The contract content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  isPdf: z.boolean().optional().describe('Indicates if the contract is a PDF (for prompt logic).')
});

export const ChatWithContractsInputSchema = z.object({
  userQuery: z.string().describe("The user's question about the contracts."),
  contracts: z.array(ContractSchema).describe('An array of contracts to chat about.'),
});

export const ChatWithContractsOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user query.'),
});


// Schemas for summarize-contract-flow
export const SummarizeContractInputSchema = z.object({
  contractDataUri: z.string().describe(
    "The contract content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

export const SummarizeContractOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the contract.'),
});
