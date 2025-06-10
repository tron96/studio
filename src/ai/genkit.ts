
import { genkit } from 'genkit'; // Import the 'genkit' function for initialization
import { googleAI } from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next'; // Default import should be correct
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Configure Genkit by calling the 'genkit' function with plugins
const configuredAI = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_API_KEY as string }),
    nextPlugin, // Use the imported plugin directly
  ],
  // logLevel and enableTracing are typically set via ENV or CLI in Genkit 1.x
  // e.g., GENKIT_LOG_LEVEL=debug GENKIT_ENABLE_TRACING=true
});

// Export the configured AI instance for direct import by flows
export { configuredAI as ai };
