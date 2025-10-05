import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { topic } = await req.json();

  const result = streamObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      question: z.string().describe('A clear, focused question about the topic'),
      answer: z.string().describe('A concise but complete answer to the question'),
      hint: z.string().describe('A helpful hint if the learner is stuck'),
    }),
    prompt: `Generate 10 educational flashcards about: ${topic}.
    Each flashcard should have:
    - A clear, focused question that tests understanding
    - A concise but complete answer
    - A helpful hint for learners who might be stuck

    Make them progressively more challenging, starting with basic concepts and moving to advanced topics.
    Focus on understanding, not just memorization.`,
  });

  return result.toTextStreamResponse();
}
