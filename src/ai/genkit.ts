
import { genkit } from 'genkit';
// Use a more generic name for the default export, as it might act as both plugin factory and model helper
import huggingFace from 'genkitx-huggingface';
import { config } from 'dotenv';

config(); // Ensure environment variables are loaded

// Define the Llama model instance using Hugging Face Inference API helper
const llamaModel = huggingFace({
  name: 'huggingface/meta-llama/Llama-3.2-1B-Instruct', // Unique name for Genkit to refer to this model
  model: 'meta-llama/Llama-3.2-1B-Instruct', // The actual Hugging Face model ID
  auth: { token: process.env.HUGGING_FACE_ACCESS_TOKEN! }, // Ensure auth is present for the model definition
});

export const ai = genkit({
  plugins: [
    // Initialize the Hugging Face plugin with the authentication token
    huggingFace({ auth: { token: process.env.HUGGING_FACE_ACCESS_TOKEN! } }) // Auth also present for the plugin
  ],
  models: [llamaModel], // Register the Llama model instance
  model: 'huggingface/meta-llama/Llama-3.2-1B-Instruct', // Set Llama as the default model
  telemetry: {
    instrumentation: {
      allowMetrics: true,
    },
    logger: {
      // console: true,
    }
  }
});
