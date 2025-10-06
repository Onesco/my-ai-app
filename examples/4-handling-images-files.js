import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';

/**
 * HANDLING IMAGES AND FILES
 * This example demonstrates how to work with images and files:
 * 1. Analyzing images from URLs
 * 2. Analyzing local image files
 * 3. Processing PDFs and documents
 * 4. Multi-modal inputs (text + images)
 */

// Example 1: Analyze image from URL
async function analyzeImageFromURL() {
  console.log('=== ANALYZING IMAGE FROM URL ===\n');

  const result = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image in detail. What do you see and what does it represent?' },
          {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

// Example 2: Analyze local image file
async function analyzeLocalImage(imagePath) {
  console.log('\n=== ANALYZING LOCAL IMAGE ===\n');

  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`);
    console.log('Skipping local image analysis...');
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const result = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What is in this image? Provide a detailed analysis.' },
          {
            type: 'image',
            image: `data:${mimeType};base64,${base64Image}`,
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

// Example 3: Multi-image comparison
async function compareImages() {
  console.log('\n=== COMPARING MULTIPLE IMAGES ===\n');

  const result = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Compare these two images and explain their differences and similarities.' },
          {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
          },
          {
            type: 'image',
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

// Example 4: Document/PDF processing simulation
async function analyzeDocument(documentPath) {
  console.log('\n=== ANALYZING DOCUMENT ===\n');

  if (!fs.existsSync(documentPath)) {
    console.log(`Document not found: ${documentPath}`);
    console.log('Creating example with text extraction...\n');

    // Simulate document content
    const documentContent = `
    Machine Learning Fundamentals

    Chapter 1: Introduction
    Machine learning is a subset of artificial intelligence that enables systems to learn from data.

    Key Concepts:
    - Supervised Learning
    - Unsupervised Learning
    - Reinforcement Learning
    `;

    const result = await generateText({
      model: openai('gpt-4o'),
      prompt: `Summarize this document and create a study guide:\n\n${documentContent}`,
    });

    console.log(result.text);
    return;
  }

  const content = fs.readFileSync(documentPath, 'utf-8');
  const result = await generateText({
    model: openai('gpt-4o'),
    prompt: `Analyze this document and create key takeaways:\n\n${content}`,
  });

  console.log(result.text);
}

// Example 5: Image-to-structured-data
async function imageToStructuredData(imageUrl) {
  console.log('\n=== IMAGE TO STRUCTURED DATA ===\n');

  const result = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this image and extract information into JSON format with fields: description, mainElements (array), colors (array), context, and category.',
          },
          {
            type: 'image',
            image: imageUrl,
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

// Run examples
async function runAllExamples() {
  const imagePath = process.argv[2] || './sample-image.png';
  const documentPath = process.argv[3] || './sample-document.txt';

  await analyzeImageFromURL();
  await analyzeLocalImage(imagePath);
  await compareImages();
  await analyzeDocument(documentPath);
  await imageToStructuredData('https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400');
}

runAllExamples().catch(console.error);
