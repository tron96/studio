
import {genkit} from 'genkit';
import * as hf from 'genkitx-huggingface'; // Changed import
import { config } from 'dotenv';

config(); // Ensure environment variables are loaded

// Define the Llama model instance using Hugging Face Inference API
const llamaModel = hf.huggingFaceInference({ // Changed usage
  name: 'huggingface/meta-llama/Llama-3.2-1B-Instruct', // Unique name for Genkit to refer to this model
  model: 'meta-llama/Llama-3.2-1B-Instruct', // The actual Hugging Face model ID
  auth: { token: process.env.HUGGING_FACE_ACCESS_TOKEN! }, // Auth token from environment variable
});

export const ai = genkit({
  plugins: [
    // Removed googleAI() plugin
  ],
  models: [llamaModel], // Register the Llama model instance
  model: 'huggingface/meta-llama/Llama-3.2-1B-Instruct', // Set Llama as the default model
  telemetry: {
    instrumentation: {
      allowMetrics: true, // Example: enable metrics if desired
    },
    logger: {
      // console: true, // Example: enable console logging for telemetry if desired
    }
  }
});
