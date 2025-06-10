
import { genkit } from 'genkit';
// Try importing the function directly as the default export
import huggingFaceInference from 'genkitx-huggingface';
import { config } from 'dotenv';

config(); // Ensure environment variables are loaded

// Define the Llama model instance using Hugging Face Inference API
const llamaModel = huggingFaceInference({ // Call the imported function directly
  name: 'huggingface/meta-llama/Llama-3.2-1B-Instruct', // Unique name for Genkit to refer to this model
  model: 'meta-llama/Llama-3.2-1B-Instruct', // The actual Hugging Face model ID
  auth: { token: process.env.HUGGING_FACE_ACCESS_TOKEN! }, // Auth token from environment variable
});

export const ai = genkit({
  plugins: [
    // If genkitx-huggingface also exports a plugin factory, it might need to be registered here.
    // For now, focusing on the model definition.
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
