import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { topic } = await req.json();

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

  return result.toTextStreamResponse();
}
