import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateObject, streamObject } from 'ai';
import { z } from 'zod';

/**
 * STRUCTURED OUTPUTS
 * This example demonstrates various structured output formats using Zod schemas
 */

// Example 1: Object output with nested structures
async function nestedObjectExample(topic) {
  console.log('=== NESTED OBJECT OUTPUT ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      course: z.object({
        title: z.string(),
        description: z.string(),
        instructor: z.object({
          name: z.string(),
          expertise: z.array(z.string()),
        }),
        modules: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          topics: z.array(z.string()),
        })),
      }),
    }),
    prompt: `Create a course structure about ${topic}`,
  });

  console.log(JSON.stringify(result.object, null, 2));
}

// Example 2: Array output
async function arrayOutputExample(topic) {
  console.log('\n=== ARRAY OUTPUT ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      question: z.string(),
      answer: z.string(),
      difficulty: z.number().min(1).max(10),
      tags: z.array(z.string()),
    }),
    prompt: `Generate 5 quiz questions about ${topic}`,
  });

  result.object.forEach((item, i) => {
    console.log(`Q${i + 1}: ${item.question}`);
    console.log(`A: ${item.answer}`);
    console.log(`Difficulty: ${item.difficulty}/10`);
    console.log(`Tags: ${item.tags.join(', ')}\n`);
  });
}

// Example 3: Enum output with validation
async function enumOutputExample(topic) {
  console.log('\n=== ENUM OUTPUT WITH VALIDATION ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      analysis: z.object({
        category: z.enum(['science', 'technology', 'engineering', 'mathematics', 'arts']),
        complexity: z.enum(['simple', 'moderate', 'complex', 'very_complex']),
        prerequisites: z.array(z.string()),
        learningPath: z.array(z.object({
          step: z.number(),
          title: z.string(),
          estimatedTime: z.string(),
          skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
        })),
      }),
    }),
    prompt: `Analyze the topic "${topic}" and create a learning path`,
  });

  console.log('Category:', result.object.analysis.category);
  console.log('Complexity:', result.object.analysis.complexity);
  console.log('\nLearning Path:');
  result.object.analysis.learningPath.forEach(step => {
    console.log(`  ${step.step}. ${step.title} (${step.estimatedTime}) [${step.skillLevel}]`);
  });
}

// Example 4: No-schema mode (free-form JSON)
async function noSchemaExample(topic) {
  console.log('\n=== NO-SCHEMA MODE (Free-form JSON) ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    output: 'no-schema',
    prompt: `Create a JSON structure for a study guide about ${topic}. Include whatever fields you think are relevant.`,
  });

  console.log(JSON.stringify(result.object, null, 2));
}

// Run all examples
async function runAllExamples() {
  const topic = process.argv[2] || 'Quantum Computing';

  await nestedObjectExample(topic);
  await arrayOutputExample(topic);
  await enumOutputExample(topic);
  await noSchemaExample(topic);
}

runAllExamples().catch(console.error);
