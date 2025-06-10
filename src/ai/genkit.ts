'use server';
import { ai as genkitAIInstance } from 'genkit'; // Alias to avoid confusion if 'ai' is used locally
import { googleAI } from '@genkit-ai/googleai';
import { nextPlugin } from '@genkit-ai/next';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Configure the global genkitAIInstance object that flows will use when they import 'ai' from 'genkit'
// or when they import 'ai' from this file.
genkitAIInstance({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_API_KEY as string }),
    nextPlugin(), // For Next.js integration context
  ],
  // logLevel and enableTracing are typically set via ENV or CLI in Genkit 1.x
});

// Export the configured AI instance for direct import by flows, following the plant example pattern.
export { genkitAIInstance as ai };
