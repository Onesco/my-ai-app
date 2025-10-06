import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import * as readline from 'readline/promises';

/**
 * MESSAGE HISTORY (via CoreMessage Type)
 * This example demonstrates how to maintain conversation context using message history
 */

// Conversation storage
const conversationHistory = [];

// Tools for the assistant
const tools = {
  saveNote: {
    description: 'Save a note or fact mentioned in the conversation',
    parameters: z.object({
      note: z.string().describe('The note to save'),
      category: z.string().describe('Category for the note'),
    }),
    execute: async ({ note, category }) => {
      const saved = { note, category, timestamp: new Date().toISOString() };
      conversationHistory.push({
        type: 'note',
        data: saved,
      });
      return saved;
    },
  },

  recallNotes: {
    description: 'Recall previously saved notes',
    parameters: z.object({
      category: z.string().optional().describe('Filter by category'),
    }),
    execute: async ({ category }) => {
      const notes = conversationHistory
        .filter(item => item.type === 'note')
        .filter(item => !category || item.data.category === category)
        .map(item => item.data);
      return notes;
    },
  },
};

// Example 1: Basic conversation with history
async function basicConversationWithHistory() {
  console.log('=== BASIC CONVERSATION WITH HISTORY ===\n');

  const messages = [];

  // First interaction
  messages.push({
    role: 'user',
    content: 'Hi! I want to learn about Machine Learning. Can you help me?',
  });

  let result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  messages.push({
    role: 'assistant',
    content: result.text,
  });

  console.log('Assistant:', result.text, '\n');

  // Second interaction - references previous context
  messages.push({
    role: 'user',
    content: 'What are the prerequisites for it?',
  });

  result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  messages.push({
    role: 'assistant',
    content: result.text,
  });

  console.log('Assistant:', result.text, '\n');

  // Third interaction - further context
  messages.push({
    role: 'user',
    content: 'Can you create a 2-week learning plan for me based on what we discussed?',
  });

  result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  console.log('Assistant:', result.text, '\n');
}

// Example 2: Multi-turn conversation with system messages
async function conversationWithSystemMessage() {
  console.log('\n=== CONVERSATION WITH SYSTEM MESSAGE ===\n');

  const messages = [
    {
      role: 'system',
      content: 'You are a patient and knowledgeable tutor specializing in programming. Always provide examples and encourage the student.',
    },
    {
      role: 'user',
      content: 'I am struggling with JavaScript promises. Can you help?',
    },
  ];

  let result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  messages.push({
    role: 'assistant',
    content: result.text,
  });

  console.log('Tutor:', result.text, '\n');

  // Follow-up question
  messages.push({
    role: 'user',
    content: 'Can you show me a simple example?',
  });

  result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  console.log('Tutor:', result.text, '\n');
}


// Example 3: Formatted CoreMessage examples
async function coreMessageExamples() {
  console.log('\n=== COREMESSAGE TYPE EXAMPLES ===\n');

  // Example with different message types
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful coding assistant.',
    },
    {
      role: 'user',
      content: 'Explain async/await',
    },
    {
      role: 'assistant',
      content: 'Async/await is a way to write asynchronous code that looks synchronous...',
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Can you provide a code example?',
        },
      ],
    },
  ];

  const result = await generateText({
    model: openai('gpt-4o'),
    messages,
  });

  console.log('Response:', result.text, '\n');

  // Show message history structure
  console.log('Message History Structure:');
  console.log(JSON.stringify(messages, null, 2));
}

// Example 4: Conversation summarization with history
async function conversationSummarization() {
  console.log('\n=== CONVERSATION SUMMARIZATION ===\n');

  const longConversation = [
    { role: 'user', content: 'Tell me about Python' },
    { role: 'assistant', content: 'Python is a high-level programming language...' },
    { role: 'user', content: 'What about its syntax?' },
    { role: 'assistant', content: 'Python uses indentation for code blocks...' },
    { role: 'user', content: 'How do I define functions?' },
    { role: 'assistant', content: 'You use the def keyword to define functions...' },
    { role: 'user', content: 'What are decorators?' },
    { role: 'assistant', content: 'Decorators are a way to modify function behavior...' },
  ];

  // Summarize the conversation
  const summaryResult = await generateText({
    model: openai('gpt-4o'),
    messages: [
      ...longConversation,
      {
        role: 'user',
        content: 'Please summarize our entire conversation so far in 3-4 bullet points.',
      },
    ],
  });

  console.log('Conversation Summary:');
  console.log(summaryResult.text);

  // Continue conversation with summary context
  const continueResult = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `Previous conversation summary: ${summaryResult.text}`,
      },
      {
        role: 'user',
        content: 'Based on what we discussed, what should I learn next?',
      },
    ],
  });

  console.log('\nRecommendation based on history:');
  console.log(continueResult.text);
}

// Example 5: Interactive conversation loop (commented out, can be run separately)
async function interactiveConversation() {
  console.log('\n=== INTERACTIVE CONVERSATION ===');
  console.log('Type "exit" to end the conversation\n');

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful learning assistant. Keep track of what the user has learned and build on previous context.',
    },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await rl.question('You: ');

    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      break;
    }

    messages.push({
      role: 'user',
      content: userInput,
    });

    const result = await generateText({
      model: openai('gpt-4o'),
      tools,
      messages,
      maxSteps: 5,
    });

    messages.push({
      role: 'assistant',
      content: result.text,
    });

    console.log('Assistant:', result.text, '\n');
  }
}

// Run all examples
async function runAllExamples() {
  await basicConversationWithHistory();
  await conversationWithSystemMessage();
  // Skip tools example due to SDK compatibility issues
  // await conversationWithToolsAndHistory();
  await coreMessageExamples();
  await conversationSummarization();

  // Uncomment to run interactive mode
  // await interactiveConversation();
}

runAllExamples().catch(console.error);
