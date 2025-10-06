import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
 const { anthropic } = await import('@ai-sdk/anthropic');

/**
 * HOT-SWAPPING MODELS
 * This example demonstrates how to dynamically switch between different AI models
 */

async function generateSlidesWithModelSelection(topic, modelProvider = 'openai') {
  console.log(`Generating slides for topic: ${topic}`);
  console.log(`Using model provider: ${modelProvider}\n`);

  // Hot-swap between different models based on user input
  let selectedModel;

  if (modelProvider === 'anthropic' || modelProvider === 'anthropic-haiku') {
   
    const modelMap = {
      'anthropic': anthropic('claude-3-5-sonnet-20241022'),
      'anthropic-haiku': anthropic('claude-3-5-haiku-20241022'),
    };
    selectedModel = modelMap[modelProvider];
  } else {
    const modelMap = {
      'openai': openai('gpt-4o'),
      'openai-mini': openai('gpt-4o-mini'),
    };
    selectedModel = modelMap[modelProvider] || openai('gpt-4o');
  }

  try {
    const result = await generateObject({
      model: selectedModel,
      output: 'array',
      schema: z.object({
        title: z.string(),
        keyPoints: z.array(z.string()),
        detailedExplanation: z.string(),
      }),
      prompt: `Generate 3 educational slides about: ${topic}`,
    });

    const finalResult = result.object;

    console.log(`\n=== Slides generated using ${modelProvider} ===\n`);
    finalResult.forEach((slide, index) => {
      console.log(`Slide ${index + 1}: ${slide.title}`);
      console.log(`Points: ${slide.keyPoints.join(', ')}\n`);
    });
  } catch (error) {
    console.error('Error generating slides:', error.message);
    throw error;
  }
}

// Usage: node 1-hot-swapping-models.js "AI Ethics" openai
const topic = process.argv[2] || 'Artificial Intelligence';
const modelProvider = process.argv[3] || 'openai';

generateSlidesWithModelSelection(topic, modelProvider).catch(console.error);
