import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

async function generateSlides(topic) {
  console.log(`Generating slides for topic: ${topic}\n`);

  const result = streamObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      title: z.string().describe('The main topic/question title'),
      keyPoints: z.array(z.string()).describe('3-5 key bullet points explaining the concept'),
      detailedExplanation: z.string().describe('A detailed explanation of the concept'),
      example: z.string().describe('A practical example or use case'),
      relatedConcepts: z.array(z.string()).describe('2-3 related concepts to explore'),
    }),
    prompt: `Generate atleast 10 detailed educational slides about: ${topic}.
    Each slide should be comprehensive and informative, like a presentation slide.
    Include key points, detailed explanations, practical examples, and related concepts.
    Make them progressively more detailed, starting with basics and moving to advanced topics.`,
  });

  // Stream and print partial objects as they arrive
  for await (const partialObject of result.partialObjectStream) {
    console.clear();
    console.log(`Generating slides for topic: ${topic}\n`);
    console.log('Current slides:', JSON.stringify(partialObject, null, 2));
  }

  // Get final result
  const finalResult = await result.object;

  console.clear();
  console.log(`\n=== Final Slides for: ${topic} ===\n`);

  finalResult.forEach((slide, index) => {
    console.log(`\n--- Slide ${index + 1} ---`);
    console.log(`Title: ${slide.title}`);
    console.log(`\nKey Points:`);
    slide.keyPoints.forEach((point, i) => console.log(`  ${i + 1}. ${point}`));
    console.log(`\nDetailed Explanation:\n${slide.detailedExplanation}`);
    console.log(`\nExample:\n${slide.example}`);
    console.log(`\nRelated Concepts:`);
    slide.relatedConcepts.forEach((concept, i) => console.log(`  ${i + 1}. ${concept}`));
    console.log('\n' + '='.repeat(50));
  });
}

// Get topic from command line argument or use default
const topic = process.argv[2] || 'Machine Learning';

generateSlides(topic).catch(console.error);
