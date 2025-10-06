import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { streamText, streamObject } from 'ai';
import { z } from 'zod';

/**
 * STREAMING
 * This example demonstrates different streaming approaches:
 * 1. Text streaming with real-time output
 * 2. Object streaming with partial updates
 * 3. Full-stream data streaming
 */

// Example 1: Stream text tokens as they arrive
async function streamTextExample(topic) {
  console.log('=== TEXT STREAMING ===\n');
  console.log(`Generating content about: ${topic}\n`);

  const result = streamText({
    model: openai('gpt-4o'),
    prompt: `Write a brief introduction about ${topic}`,
  });

  // Stream each token as it arrives
  process.stdout.write('Output: ');
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  console.log('\n');
}

// Example 2: Stream objects with partial updates
async function streamObjectExample(topic) {
  console.log('=== OBJECT STREAMING (Partial Updates) ===\n');

  const result = streamObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    }),
    prompt: `Generate 3 lessons about ${topic}`,
  });

  // Stream partial objects as they're built
  for await (const partialObject of result.partialObjectStream) {
    console.clear();
    console.log('Streaming lessons (partial):');
    console.log(JSON.stringify(partialObject, null, 2));
  }

  const finalResult = await result.object;
  console.log('\n=== Final Result ===');
  console.log(JSON.stringify(finalResult, null, 2));
}

// Example 3: Full-stream data access
async function fullStreamExample(topic) {
  console.log('\n=== FULL STREAM DATA ===\n');

  const result = streamText({
    model: openai('gpt-4o'),
    prompt: `Explain ${topic} in one sentence`,
  });

  // Access full stream data including metadata
  for await (const part of result.fullStream) {
    if (part.type === 'text-delta') {
      if (part.textDelta) {
        process.stdout.write(part.textDelta);
      }
    } else if (part.type === 'finish') {
      console.log('\n\nStream finished!');
      console.log(`Usage: ${JSON.stringify(part.usage)}`);
      console.log(`Finish reason: ${part.finishReason}`);
    }
  }
}

// Run all examples
async function runAllExamples() {
  const topic = process.argv[2] || 'Machine Learning';

  await streamTextExample(topic);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await streamObjectExample(topic);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await fullStreamExample(topic);
}

runAllExamples().catch(console.error);
