import 'dotenv/config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

/**
 * HOOK TO LOCAL RUNNING AI MODELS (via createOpenAI)
 * This example demonstrates how to connect to locally running AI models
 * that are compatible with the OpenAI API format
 *
 * Supported local models:
 * - Ollama (http://localhost:11434)
 * - LM Studio (http://localhost:1234)
 * - LocalAI (http://localhost:8080)
 * - vLLM (custom port)
 * - Text Generation WebUI (custom port)
 */

// Example 1: Connect to Ollama (local model)
async function connectToOllama() {
  console.log('=== CONNECTING TO OLLAMA (Local Model) ===\n');

  const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', // Ollama doesn't require an API key
  });

  try {
    const result = await generateText({
      model: ollama('llama2'),
      prompt: 'Explain machine learning in simple terms.',
    });

    console.log('Ollama Response:', result.text);
  } catch (error) {
    console.log('Error connecting to Ollama:', error.message);
    console.log('Make sure Ollama is running: ollama serve');
    console.log('And the model is installed: ollama pull llama2\n');
  }
}

// Example 2: Connect to LM Studio (local model)
async function connectToLMStudio() {
  console.log('\n=== CONNECTING TO LM STUDIO (Local Model) ===\n');

  const lmstudio = createOpenAI({
    baseURL: 'http://localhost:1234/v1',
    apiKey: 'lm-studio', // LM Studio doesn't require an API key
  });

  try {
    const result = await generateText({
      model: lmstudio('local-model'),
      prompt: 'Write a haiku about coding.',
    });

    console.log('LM Studio Response:', result.text);
  } catch (error) {
    console.log('Error connecting to LM Studio:', error.message);
    console.log('Make sure LM Studio server is running on port 1234\n');
  }
}

// Example 3: Connect to LocalAI
async function connectToLocalAI() {
  console.log('\n=== CONNECTING TO LOCALAI ===\n');

  const localai = createOpenAI({
    baseURL: 'http://localhost:8080/v1',
    apiKey: 'local',
  });

  try {
    const result = await generateText({
      model: localai('gpt-3.5-turbo'),
      prompt: 'What is the capital of France?',
    });

    console.log('LocalAI Response:', result.text);
  } catch (error) {
    console.log('Error connecting to LocalAI:', error.message);
    console.log('Make sure LocalAI is running on port 8080\n');
  }
}

// Example 4: Streaming with local model
async function streamingWithLocalModel() {
  console.log('\n=== STREAMING WITH LOCAL MODEL ===\n');

  const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
  });

  try {
    const result = streamText({
      model: ollama('llama2'),
      prompt: 'Write a short story about a robot learning to code.',
    });

    process.stdout.write('Streaming response: ');
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }
    console.log('\n');
  } catch (error) {
    console.log('Error streaming from local model:', error.message);
  }
}

// Example 5: Custom local model configuration
async function customLocalModel() {
  console.log('\n=== CUSTOM LOCAL MODEL CONFIGURATION ===\n');

  const customModel = createOpenAI({
    name: 'my-custom-model',
    baseURL: process.env.LOCAL_MODEL_URL || 'http://localhost:8000/v1',
    apiKey: process.env.LOCAL_MODEL_API_KEY || 'custom',
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  });

  try {
    const result = await generateText({
      model: customModel('custom-model-name'),
      prompt: 'Explain quantum computing.',
      temperature: 0.7,
      maxTokens: 200,
    });

    console.log('Custom Model Response:', result.text);
  } catch (error) {
    console.log('Error connecting to custom model:', error.message);
  }
}

// Example 6: Comparing local vs cloud models
async function compareModels(prompt) {
  console.log('\n=== COMPARING LOCAL VS CLOUD MODELS ===\n');
  console.log(`Prompt: "${prompt}"\n`);

  // Local model (Ollama)
  const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
  });

  try {
    console.log('Local Model (Ollama) Response:');
    const localResult = await generateText({
      model: ollama('llama2'),
      prompt,
    });
    console.log(localResult.text);
  } catch (error) {
    console.log('Local model not available:', error.message);
  }

  // Cloud model (OpenAI)
  try {
    console.log('\nCloud Model (OpenAI) Response:');
    const { openai } = await import('@ai-sdk/openai');
    const cloudResult = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });
    console.log(cloudResult.text);
  } catch (error) {
    console.log('Cloud model error:', error.message);
  }
}

// Example 7: Tool usage with local models
async function localModelWithTools() {
  console.log('\n=== LOCAL MODEL WITH TOOLS ===\n');

  const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
  });

  const tools = {
    getCurrentTime: {
      description: 'Get the current time',
      parameters: {},
      execute: async () => {
        return { time: new Date().toLocaleTimeString() };
      },
    },
  };

  try {
    const result = await generateText({
      model: ollama('llama2'),
      tools,
      maxSteps: 3,
      prompt: 'What time is it now?',
    });

    console.log('Response:', result.text);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Note: Tool calling may not be supported by all local models');
  }
}

// Example 8: Setup guide
function printSetupGuide() {
  console.log('\n=== SETUP GUIDE FOR LOCAL MODELS ===\n');

  console.log('1. OLLAMA:');
  console.log('   - Install: https://ollama.ai/download');
  console.log('   - Run: ollama serve');
  console.log('   - Install model: ollama pull llama2');
  console.log('   - Default port: 11434\n');

  console.log('2. LM STUDIO:');
  console.log('   - Install: https://lmstudio.ai/');
  console.log('   - Load a model in the UI');
  console.log('   - Start the local server (port 1234)');
  console.log('   - Default port: 1234\n');

  console.log('3. LOCALAI:');
  console.log('   - Install: https://localai.io/');
  console.log('   - Run with Docker: docker run -p 8080:8080 localai/localai');
  console.log('   - Default port: 8080\n');

  console.log('4. CUSTOM MODEL:');
  console.log('   - Set LOCAL_MODEL_URL environment variable');
  console.log('   - Set LOCAL_MODEL_API_KEY if needed');
  console.log('   - Ensure it implements OpenAI-compatible API\n');
}

// Run simplified example
async function runExample() {
  printSetupGuide();

  console.log('\n=== EXAMPLE: CONNECTING TO OLLAMA ===\n');
  await connectToOllama();

  console.log('\n--- Example Complete ---');
  console.log('\nNote: If connection failed, local model is not running (expected).');
  console.log('To use local models:');
  console.log('1. Install Ollama from https://ollama.ai/download');
  console.log('2. Run: ollama serve');
  console.log('3. Install a model: ollama pull llama2');
  console.log('4. Run this example again\n');
}

runExample().catch(console.error);
