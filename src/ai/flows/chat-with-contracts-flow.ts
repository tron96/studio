'use server';
/**
 * @fileOverview AI flow for chatting about uploaded contract texts using @xenova/transformers.
 *
 * - chatWithContracts - A function to handle chat queries about contracts.
 * - ChatWithContractsInput - The input type for the chatWithContracts function.
 * - ChatWithContractsOutput - The return type for the chatWithContracts function.
 */

import { pipeline, type Pipeline } from '@xenova/transformers';

export interface Contract {
  fileName: string;
  contentText: string; // Changed from contentDataUri
}

export interface ChatWithContractsInput {
  userQuery: string;
  contracts: Contract[];
}

export interface ChatWithContractsOutput {
  aiResponse: string;
}

// Initialize the text generation pipeline once
let generator: Pipeline | null = null;
const modelName = 'Xenova/Llama-3.2-1B-Instruct';

async function getGenerator() {
  if (!generator) {
     try {
      generator = await pipeline('text-generation', modelName, {
        // progress_callback: (progress: any) => console.log('Model loading progress:', progress),
      });
    } catch (error) {
      console.error('Failed to load text generation model:', error);
      throw new Error('Failed to load text generation model. Please check server logs.');
    }
  }
  return generator;
}

function buildPrompt(input: ChatWithContractsInput): string {
  let contractInfo = "";
  if (input.contracts.length > 0) {
    contractInfo = "Here are the contracts:\n";
    input.contracts.forEach(contract => {
      contractInfo += `Contract Filename: ${contract.fileName}\n`;
      contractInfo += `Contract Content:\n${contract.contentText}\n---\n`;
    });
  } else {
    contractInfo = "No contracts have been provided. You can inform the user to upload contracts if their question implies they expect you to have some.\n";
  }

  return `You are a helpful AI assistant specializing in contract analysis.
You have been provided with the following contract(s). Your task is to answer the user's question based *only* on the information contained within these documents.
If the information is not found in the contracts, state that explicitly. Do not make assumptions or use external knowledge.

${contractInfo}
User's Question: ${input.userQuery}

AI Response:`;
}

export async function chatWithContracts(
  input: ChatWithContractsInput
): Promise<ChatWithContractsOutput> {
  if (!input.userQuery || input.userQuery.trim() === "") {
    return { aiResponse: "No user query provided." };
  }

  const loadedGenerator = await getGenerator();
   if (!loadedGenerator) {
    return { aiResponse: "Text generation model is not available." };
  }

  const prompt = buildPrompt(input);

  try {
    const outputs = await loadedGenerator(prompt, {
      max_new_tokens: 300, // Adjust as needed
      temperature: 0.7,
      repetition_penalty: 1.1,
      // num_beams: 3,
      // early_stopping: true,
    });

    let aiResponseText = "";
    if (Array.isArray(outputs) && outputs.length > 0 && outputs[0].generated_text) {
      // The model might return the prompt + response, so we try to extract just the response part
      const fullText = outputs[0].generated_text;
      const responseMarker = "AI Response:";
      const responseStartIndex = fullText.lastIndexOf(responseMarker);
      if (responseStartIndex !== -1) {
        aiResponseText = fullText.substring(responseStartIndex + responseMarker.length).trim();
      } else {
         // Fallback if the marker isn't found
        aiResponseText = fullText.replace(prompt.replace('AI Response:','').trim(), '').trim();
      }
    } else {
      console.warn("No valid AI response generated, or unexpected output format:", outputs);
      aiResponseText = "Could not generate a response to your query.";
    }
    
    return { aiResponse: aiResponseText || "No response generated." };
  } catch (error) {
    console.error('Error during chat with contracts:', error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return { aiResponse: `Failed to process chat: ${errorMessage}` };
  }
}
