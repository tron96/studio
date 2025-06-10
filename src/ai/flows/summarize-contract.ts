'use server';
/**
 * @fileOverview Summarizes contract text using @xenova/transformers.
 *
 * - summarizeContract - A function that handles the contract summarization process.
 * - SummarizeContractInput - The input type for the summarizeContract function.
 * - SummarizeContractOutput - The return type for the summarizeContract function.
 */

import { pipeline, type Pipeline } from '@xenova/transformers';

export interface SummarizeContractInput {
  contractText: string;
}

export interface SummarizeContractOutput {
  summary: string;
}

// Initialize the summarization pipeline once
let summarizer: Pipeline | null = null;
const modelName = 'Xenova/Llama-3.2-1B-Instruct'; // Or a more specific summarization model if preferred

async function getSummarizer() {
  if (!summarizer) {
    try {
      summarizer = await pipeline('text-generation', modelName, {
        // For some models, progress_callback can be useful in server environments
        // progress_callback: (progress: any) => console.log('Model loading progress:', progress),
      });
    } catch (error) {
      console.error('Failed to load summarization model:', error);
      throw new Error('Failed to load summarization model. Please check server logs.');
    }
  }
  return summarizer;
}

export async function summarizeContract(
  input: SummarizeContractInput
): Promise<SummarizeContractOutput> {
  if (!input.contractText || input.contractText.trim() === "") {
    return { summary: "No contract text provided to summarize." };
  }

  const loadedSummarizer = await getSummarizer();
  if (!loadedSummarizer) {
    // This case should ideally be handled by the error in getSummarizer,
    // but as a fallback:
    return { summary: "Summarization model is not available." };
  }

  const prompt = `You are an expert legal contract summarizer.
Please provide a concise summary of the key terms of the following contract text, including but not limited to: pricing, delivery terms, duration, and the parties involved.

Contract Text:
${input.contractText}

Summary:`;

  try {
    const outputs = await loadedSummarizer(prompt, {
      max_new_tokens: 250, // Adjust as needed for summary length
      temperature: 0.2,    // Lower temperature for more focused summaries
      repetition_penalty: 1.1,
      // num_beams: 3, // Can improve quality but slower
      // early_stopping: true, // Stop when EOS token is generated
    });
    
    let generatedSummary = "";
    if (Array.isArray(outputs) && outputs.length > 0 && outputs[0].generated_text) {
      // The model might return the prompt + summary, so we try to extract just the summary part
      const fullText = outputs[0].generated_text;
      const summaryMarker = "Summary:";
      const summaryStartIndex = fullText.lastIndexOf(summaryMarker);
      if (summaryStartIndex !== -1) {
        generatedSummary = fullText.substring(summaryStartIndex + summaryMarker.length).trim();
      } else {
        // Fallback if the marker isn't found (e.g. model didn't follow prompt structure exactly)
        // This might need refinement based on actual model output.
        // For now, assume the last part after the prompt is the summary.
        generatedSummary = fullText.replace(prompt.replace('Summary:','').trim(), '').trim();

      }
    } else {
      console.warn("No valid summary generated, or unexpected output format:", outputs);
      generatedSummary = "Could not generate a summary from the provided text.";
    }

    return { summary: generatedSummary || "Summary could not be generated." };
  } catch (error) {
    console.error('Error during contract summarization:', error);
    // Check if the error is an object and has a message property
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return { summary: `Failed to summarize contract: ${errorMessage}` };
  }
}
