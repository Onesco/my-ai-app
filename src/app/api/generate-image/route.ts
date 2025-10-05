import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { image } = await generateImage({
    model: openai.image('dall-e-3'),
    prompt,
  });

  return new Response(image.uint8Array, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
