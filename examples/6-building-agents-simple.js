import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

/**
 * BUILDING AGENTS (Simplified)
 * This example demonstrates autonomous AI agents without tool calling
 * Shows how agents can reason, plan, and execute tasks
 */

// Example 1: Research Agent
async function researchAgent(topic) {
  console.log('=== RESEARCH AGENT ===\n');
  console.log(`Topic: ${topic}\n`);

  const result = await generateText({
    model: openai.chat('gpt-4o'),
    system: `You are a research specialist agent. Your job is to:
1. Analyze the given topic thoroughly
2. Identify key concepts and subtopics
3. Organize information in a structured way
4. Provide comprehensive insights

Be thorough and systematic in your research.`,
    prompt: `Research the topic: ${topic}

Provide:
1. Overview of the topic
2. Key concepts (5-7 main points)
3. Important subtopics to explore
4. Prerequisites for learning this topic
5. Practical applications`,
  });

  console.log(result.text);
  return result.text;
}

// Example 2: Planning Agent
async function planningAgent(topic, researchSummary) {
  console.log('\n\n=== PLANNING AGENT ===\n');

  const result = await generateText({
    model: openai.chat('gpt-4o'),
    system: `You are a learning plan specialist agent. Create optimal learning strategies based on research.`,
    prompt: `Based on this research about ${topic}:

${researchSummary}

Create a detailed 4-week learning plan including:
1. Week-by-week breakdown
2. Daily study goals
3. Milestones and checkpoints
4. Recommended resources for each week`,
  });

  console.log(result.text);
  return result.text;
}

// Example 3: Multi-Agent System
async function multiAgentSystem(topic) {
  console.log('=== MULTI-AGENT SYSTEM ===\n');
  console.log(`Orchestrating multiple agents for: ${topic}\n`);

  // Agent 1: Research
  console.log('🔍 Agent 1: Researching...\n');
  const research = await researchAgent(topic);

  // Agent 2: Planning
  console.log('📋 Agent 2: Creating learning plan...\n');
  const plan = await planningAgent(topic, research);

  // Agent 3: Resource Curator
  console.log('📚 Agent 3: Curating resources...\n');
  const resources = await generateText({
    model: openai.chat('gpt-4o'),
    system: 'You are a resource curator. Find and organize the best learning materials.',
    prompt: `Based on this learning plan for ${topic}, recommend:
1. Top 3 online courses
2. Top 3 books
3. Top 5 websites/blogs
4. Top 3 YouTube channels
5. Practice projects

Format as a curated list with brief descriptions.`,
  });

  console.log(resources.text);

  return { research, plan, resources: resources.text };
}

// Example 4: Reasoning Agent
async function reasoningAgent(goal) {
  console.log('\n\n=== REASONING AGENT ===\n');
  console.log(`Goal: ${goal}\n`);

  const result = await generateText({
    model: openai.chat('gpt-4o'),
    system: `You are an intelligent reasoning agent. Break down goals into actionable steps.

For each goal:
1. Analyze the goal and its requirements
2. Break it into sub-goals
3. Determine dependencies and order
4. Create an action plan with reasoning
5. Identify potential challenges

Think step-by-step and explain your reasoning.`,
    prompt: `My goal is: ${goal}

Help me achieve it by:
1. Breaking it down into sub-goals
2. Creating a step-by-step action plan
3. Explaining your reasoning for each step
4. Identifying potential challenges and solutions`,
  });

  console.log(result.text);
}

// Example 5: Streaming Agent (shows thinking process)
async function streamingAgent(task) {
  console.log('\n\n=== STREAMING AGENT (Live Thinking) ===\n');
  console.log(`Task: ${task}\n`);
  console.log('Agent thinking...\n');

  const result = streamText({
    model: openai.chat('gpt-4o'),
    system: `You are an agent that shows your thinking process. For each task:
1. State what you're doing
2. Explain your reasoning
3. Show your work step by step
4. Provide the final solution`,
    prompt: task,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log('\n');
}

// Example 6: Adaptive Agent
async function adaptiveAgent(userHistory) {
  console.log('\n\n=== ADAPTIVE AGENT ===\n');

  const result = await generateText({
    model: openai.chat('gpt-4o'),
    system: `You are an adaptive learning agent. Analyze user behavior and optimize strategies.`,
    prompt: `Analyze this user's learning history:

${JSON.stringify(userHistory, null, 2)}

Provide:
1. Learning pattern analysis
2. Strengths and weaknesses
3. Personalized recommendations
4. Optimized study strategy
5. Next steps`,
  });

  console.log(result.text);
}

// Run agent examples
async function runAllAgents() {
  const topic = process.argv[2] || 'Machine Learning';

  // Single agents
  console.log('━'.repeat(60));
  console.log('  AUTONOMOUS AI AGENTS DEMONSTRATION');
  console.log('━'.repeat(60));
  console.log('\n');

  // Multi-agent system
  await multiAgentSystem(topic);

  // Reasoning agent
  await reasoningAgent(`Master ${topic} in 4 weeks`);

  // Streaming agent
  await streamingAgent(`Create a beginner-friendly introduction to ${topic} with code examples`);

  // Adaptive agent
  const mockHistory = {
    completedLessons: ['Variables', 'Functions', 'Loops'],
    struggledWith: ['Recursion', 'Async/Await'],
    timeSpentPerDay: 45,
    preferredFormat: 'video',
    quizScores: [85, 78, 92, 65],
  };

  await adaptiveAgent(mockHistory);

  console.log('\n━'.repeat(60));
  console.log('  ALL AGENTS COMPLETED');
  console.log('━'.repeat(60));
}

runAllAgents().catch(console.error);
