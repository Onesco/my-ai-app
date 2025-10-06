import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';

/**
 * TOOL CALLING (Simplified Example)
 * This demonstrates the tool calling concept.
 * Note: There may be compatibility issues with certain SDK versions.
 * This example shows the structure and how tools work.
 */

console.log('=== TOOL CALLING DEMONSTRATION ===\n');

// Tool definitions - what the AI can call
const toolDefinitions = {
  getWeather: {
    description: 'Get the current weather for a location',
    parameters: {
      location: 'string - The city and state',
      unit: 'celsius or fahrenheit',
    },
    exampleCall: { location: 'San Francisco, CA', unit: 'fahrenheit' },
    exampleResponse: { location: 'San Francisco, CA', temperature: 68, unit: 'fahrenheit', condition: 'Partly cloudy' },
  },

  searchWikipedia: {
    description: 'Search Wikipedia for information',
    parameters: {
      query: 'string - The search query',
      maxResults: 'number - Maximum results (default: 3)',
    },
    exampleCall: { query: 'Machine Learning', maxResults: 3 },
    exampleResponse: {
      query: 'Machine Learning',
      results: [
        { title: 'Machine Learning - Overview', snippet: 'General information...' },
        { title: 'History of Machine Learning', snippet: 'Historical context...' },
      ],
    },
  },

  calculateComplexity: {
    description: 'Calculate learning complexity of a topic',
    parameters: {
      topic: 'string - The topic to analyze',
      targetAudience: 'beginner | intermediate | advanced',
    },
    exampleCall: { topic: 'Neural Networks', targetAudience: 'beginner' },
    exampleResponse: {
      topic: 'Neural Networks',
      targetAudience: 'beginner',
      complexityScore: 45,
      estimatedStudyHours: 90,
      prerequisites: ['Basic Python', 'Mathematics', 'Linear Algebra'],
    },
  },
};

// Display tool definitions
console.log('Available Tools:\n');
Object.entries(toolDefinitions).forEach(([name, tool]) => {
  console.log(`📌 ${name}()`);
  console.log(`   Description: ${tool.description}`);
  console.log(`   Parameters:`, tool.parameters);
  console.log(`   Example Call:`, JSON.stringify(tool.exampleCall));
  console.log(`   Example Response:`, JSON.stringify(tool.exampleResponse, null, 2));
  console.log('');
});

// Simulate tool calling workflow
console.log('\n=== TOOL CALLING WORKFLOW ===\n');

console.log('Step 1: User asks a question');
const userQuestion = 'What is the weather in San Francisco?';
console.log(`User: "${userQuestion}"\n`);

console.log('Step 2: AI decides which tool to call');
console.log('AI Decision: Use getWeather tool');
console.log('Tool Call: getWeather({ location: "San Francisco, CA", unit: "fahrenheit" })\n');

console.log('Step 3: Tool executes and returns result');
const toolResult = {
  location: 'San Francisco, CA',
  temperature: 72,
  unit: 'fahrenheit',
  condition: 'Sunny',
};
console.log('Tool Result:', JSON.stringify(toolResult, null, 2), '\n');

console.log('Step 4: AI uses tool result to generate final response');
console.log('AI Response: "The current weather in San Francisco is 72°F and sunny."\n');

// Example with multiple tools
console.log('\n=== MULTI-TOOL EXAMPLE ===\n');

console.log('User: "I want to learn about Python. How complex is it for beginners and find me some resources."\n');

console.log('AI calls multiple tools:');
console.log('1. calculateComplexity({ topic: "Python", targetAudience: "beginner" })');
console.log('   Result: { complexityScore: 25, estimatedStudyHours: 50, ... }\n');

console.log('2. searchWikipedia({ query: "Python programming", maxResults: 3 })');
console.log('   Result: { results: [...] }\n');

console.log('Final Response: "Python has a complexity score of 25/100 for beginners, requiring about 50 study hours. Here are some resources I found: [results from Wikipedia]..."\n');

// Real AI call without tools to demonstrate the concept
console.log('\n=== ACTUAL AI RESPONSE (without tool calling) ===\n');

const result = await generateText({
  model: openai.chat('gpt-4o-mini'),
  prompt: `Explain how tool calling/function calling works in AI systems.

  Use this scenario: A user asks "What's the weather in San Francisco?" and the AI has access to a getWeather() function.

  Explain the workflow step by step.`,
});

console.log(result.text);

console.log('\n\n📝 NOTE: Full tool calling with execution is temporarily disabled due to SDK compatibility issues.');
console.log('The examples demonstrate the concept and structure of tool calling.');
console.log('Check the updated examples in the repository for working implementations.\n');
