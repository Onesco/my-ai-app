import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { image } = await generateImage({
    model: openai.image('dall-e-3'),
    prompt,
  });

  // Convert Uint8Array to ArrayBuffer for Response
  const buffer = new ArrayBuffer(image.uint8Array.length);
  const view = new Uint8Array(buffer);
  view.set(image.uint8Array);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
