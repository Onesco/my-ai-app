import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

/**
 * CLASSIFICATION ANALYSIS (via Enum)
 * This example demonstrates how to use enums for classification tasks
 * such as sentiment analysis, content categorization, and difficulty assessment
 */

// Example 1: Sentiment Analysis
async function sentimentAnalysis(texts) {
  console.log('=== SENTIMENT ANALYSIS ===\n');

  for (const text of texts) {
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        text: z.string(),
        sentiment: z.enum(['positive', 'negative', 'neutral']).describe('Overall sentiment'),
        confidence: z.number().min(0).max(1).describe('Confidence score'),
        emotions: z.array(z.enum(['joy', 'anger', 'sadness', 'fear', 'surprise', 'disgust', 'frustration', 'excitement', 'confusion'])).describe('Primary emotions detected. Leave empty if neutral.'),
      }),
      prompt: `Analyze the sentiment of this text: "${text}". For emotions, only list strong emotions present. If the sentiment is neutral with no strong emotions, use an empty array for emotions.`,
    });

    console.log(`Text: "${result.object.text}"`);
    console.log(`Sentiment: ${result.object.sentiment} (${(result.object.confidence * 100).toFixed(0)}% confident)`);
    console.log(`Emotions detected: ${result.object.emotions.join(', ')}\n`);
  }
}

// Example 2: Content Categorization
async function contentCategorization(articles) {
  console.log('\n=== CONTENT CATEGORIZATION ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      title: z.string(),
      primaryCategory: z.enum([
        'technology',
        'science',
        'business',
        'health',
        'entertainment',
        'sports',
        'politics',
        'education',
      ]),
      subCategories: z.array(z.string()),
      targetAudience: z.enum(['general', 'technical', 'academic', 'children', 'professional']),
      contentType: z.enum(['news', 'tutorial', 'opinion', 'research', 'entertainment']),
    }),
    prompt: `Categorize these articles: ${JSON.stringify(articles)}`,
  });

  result.object.forEach(item => {
    console.log(`Title: ${item.title}`);
    console.log(`Category: ${item.primaryCategory}`);
    console.log(`Sub-categories: ${item.subCategories.join(', ')}`);
    console.log(`Target Audience: ${item.targetAudience}`);
    console.log(`Content Type: ${item.contentType}\n`);
  });
}

// Example 3: Difficulty Assessment
async function difficultyAssessment(topics) {
  console.log('\n=== DIFFICULTY ASSESSMENT ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      topic: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      complexity: z.enum(['very_low', 'low', 'moderate', 'high', 'very_high']),
      prerequisites: z.array(z.string()),
      estimatedLearningTime: z.object({
        hours: z.number(),
        level: z.enum(['quick', 'moderate', 'extensive', 'very_extensive']),
      }),
    }),
    prompt: `Assess the difficulty of learning these topics: ${topics.join(', ')}`,
  });

  result.object.forEach(item => {
    console.log(`Topic: ${item.topic}`);
    console.log(`Difficulty: ${item.difficulty}`);
    console.log(`Complexity: ${item.complexity}`);
    console.log(`Prerequisites: ${item.prerequisites.join(', ')}`);
    console.log(`Estimated Time: ${item.estimatedLearningTime.hours} hours (${item.estimatedLearningTime.level})\n`);
  });
}

// Example 4: Code Quality Analysis
async function codeQualityAnalysis(codeSnippet) {
  console.log('\n=== CODE QUALITY ANALYSIS ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      overallQuality: z.enum(['poor', 'fair', 'good', 'excellent']),
      readability: z.enum(['poor', 'fair', 'good', 'excellent']),
      maintainability: z.enum(['poor', 'fair', 'good', 'excellent']),
      performance: z.enum(['poor', 'fair', 'good', 'excellent']),
      securityLevel: z.enum(['critical_issues', 'has_issues', 'acceptable', 'secure']),
      issues: z.array(z.object({
        type: z.enum(['bug', 'security', 'performance', 'style', 'best_practice']),
        severity: z.enum(['critical', 'high', 'medium', 'low']),
        description: z.string(),
      })),
      recommendations: z.array(z.string()),
    }),
    prompt: `Analyze this code for quality:\n\n${codeSnippet}`,
  });

  console.log(`Overall Quality: ${result.object.overallQuality}`);
  console.log(`Readability: ${result.object.readability}`);
  console.log(`Maintainability: ${result.object.maintainability}`);
  console.log(`Performance: ${result.object.performance}`);
  console.log(`Security: ${result.object.securityLevel}\n`);

  console.log('Issues Found:');
  result.object.issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}`);
  });

  console.log('\nRecommendations:');
  result.object.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// Example 5: Learning Style Classification
async function learningStyleClassification(userBehavior) {
  console.log('\n=== LEARNING STYLE CLASSIFICATION ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      primaryLearningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading_writing']),
      learningPace: z.enum(['very_slow', 'slow', 'moderate', 'fast', 'very_fast']),
      preferredContentFormat: z.array(z.enum(['video', 'text', 'interactive', 'audio', 'diagrams'])),
      engagementLevel: z.enum(['low', 'medium', 'high', 'very_high']),
      strengths: z.array(z.string()),
      recommendations: z.array(z.object({
        type: z.enum(['content', 'pacing', 'format', 'practice']),
        suggestion: z.string(),
      })),
    }),
    prompt: `Analyze this user's learning behavior and classify their learning style: ${JSON.stringify(userBehavior)}`,
  });

  console.log(`Primary Learning Style: ${result.object.primaryLearningStyle}`);
  console.log(`Learning Pace: ${result.object.learningPace}`);
  console.log(`Preferred Formats: ${result.object.preferredContentFormat.join(', ')}`);
  console.log(`Engagement Level: ${result.object.engagementLevel}\n`);

  console.log('Strengths:');
  result.object.strengths.forEach(s => console.log(`  - ${s}`));

  console.log('\nRecommendations:');
  result.object.recommendations.forEach(rec => {
    console.log(`  [${rec.type}] ${rec.suggestion}`);
  });
}

// Example 6: Multi-label Classification
async function multiLabelClassification(content) {
  console.log('\n=== MULTI-LABEL CLASSIFICATION ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      content: z.string(),
      topics: z.array(z.enum([
        'programming',
        'web_development',
        'data_science',
        'machine_learning',
        'devops',
        'mobile',
        'security',
        'databases',
        'cloud',
        'algorithms',
      ])),
      skills: z.array(z.enum([
        'frontend',
        'backend',
        'fullstack',
        'data_analysis',
        'system_design',
        'testing',
        'deployment',
      ])),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      timeCommitment: z.enum(['quick_read', 'short', 'medium', 'long', 'very_long']),
      actionable: z.boolean().describe('Whether content has actionable steps'),
    }),
    prompt: `Perform multi-label classification on this content: "${content}"`,
  });

  console.log(`Content: "${result.object.content}"`);
  console.log(`Topics: ${result.object.topics.join(', ')}`);
  console.log(`Skills: ${result.object.skills.join(', ')}`);
  console.log(`Difficulty: ${result.object.difficulty}`);
  console.log(`Time Commitment: ${result.object.timeCommitment}`);
  console.log(`Actionable: ${result.object.actionable ? 'Yes' : 'No'}`);
}

// Example 7: Intent Classification
async function intentClassification(userQueries) {
  console.log('\n=== INTENT CLASSIFICATION ===\n');

  const result = await generateObject({
    model: openai('gpt-4o'),
    output: 'array',
    schema: z.object({
      query: z.string(),
      intent: z.enum([
        'question',
        'command',
        'feedback',
        'request_help',
        'report_issue',
        'feature_request',
        'general_conversation',
      ]),
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      urgency: z.enum(['low', 'medium', 'high', 'critical']),
      requiresAction: z.boolean(),
      suggestedResponse: z.enum(['answer', 'acknowledge', 'escalate', 'provide_resources', 'clarify']),
    }),
    prompt: `Classify the intent of these user queries: ${JSON.stringify(userQueries)}`,
  });

  result.object.forEach(item => {
    console.log(`Query: "${item.query}"`);
    console.log(`Intent: ${item.intent}`);
    console.log(`Sentiment: ${item.sentiment}`);
    console.log(`Urgency: ${item.urgency}`);
    console.log(`Requires Action: ${item.requiresAction ? 'Yes' : 'No'}`);
    console.log(`Suggested Response: ${item.suggestedResponse}\n`);
  });
}

// Run all classification examples
async function runAllExamples() {
  // Sentiment Analysis
  await sentimentAnalysis([
    'This tutorial is amazing! I finally understand React hooks.',
    'The documentation is confusing and lacks proper examples.',
    'The course is okay, nothing special.',
  ]);

  // Content Categorization
  await contentCategorization([
    { title: 'Introduction to Machine Learning Algorithms' },
    { title: 'Building Scalable Web Applications with Node.js' },
    { title: 'The Impact of AI on Healthcare Industry' },
  ]);

  // Difficulty Assessment
  await difficultyAssessment([
    'HTML and CSS Basics',
    'React Hooks and Context API',
    'Microservices Architecture with Kubernetes',
    'Quantum Computing Fundamentals',
  ]);

  // Code Quality Analysis
  const codeSnippet = `
function getData(id) {
  var data = null;
  $.ajax({
    url: '/api/data/' + id,
    async: false,
    success: function(response) {
      data = response;
    }
  });
  return data;
}
  `;
  await codeQualityAnalysis(codeSnippet);

  // Learning Style Classification
  const userBehavior = {
    completedVideos: 15,
    completedTextLessons: 5,
    interactiveExercises: 25,
    averageSessionTime: 45,
    preferredTimeOfDay: 'evening',
    completionRate: 0.85,
  };
  await learningStyleClassification(userBehavior);

  // Multi-label Classification
  await multiLabelClassification(
    'Learn how to build a REST API with Node.js and Express, including authentication, database integration, and deployment to AWS.'
  );

  // Intent Classification
  await intentClassification([
    'How do I install Python on my computer?',
    'This feature is broken and needs to be fixed immediately!',
    'Great job on the new update!',
    'Can you add dark mode support?',
  ]);
}

runAllExamples().catch(console.error);
