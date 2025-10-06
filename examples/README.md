# AI SDK Examples

This directory contains comprehensive examples demonstrating various features of the AI SDK (Vercel AI SDK). Each example is a standalone Node.js script that you can run directly.

## Prerequisites

- Node.js 18+ installed
- Dependencies installed: `pnpm install`
- `.env` file with your API keys (OpenAI, Anthropic, etc.)

## Examples Overview

### 1. Hot-Swapping Models (`1-hot-swapping-models.js`)

Demonstrates how to dynamically switch between different AI models and providers.

**Features:**
- Switch between OpenAI models (GPT-4o, GPT-4o-mini)
- Switch between Anthropic models (Claude Sonnet, Claude Haiku)
- Model selection via command-line arguments

**Usage:**
```bash
node examples/1-hot-swapping-models.js "AI Ethics" openai
node examples/1-hot-swapping-models.js "AI Ethics" anthropic
node examples/1-hot-swapping-models.js "AI Ethics" openai-mini
```

---

### 2. Streaming (`2-streaming.js`)

Shows different streaming approaches for real-time output.

**Features:**
- Text streaming with token-by-token output
- Object streaming with partial updates
- Full-stream data access with metadata

**Usage:**
```bash
node examples/2-streaming.js "Machine Learning"
```

---

### 3. Structured Outputs (`3-structured-outputs.js`)

Demonstrates various structured output formats using Zod schemas.

**Features:**
- Nested object structures
- Array outputs
- Enum validation and constraints
- No-schema mode (free-form JSON)

**Usage:**
```bash
node examples/3-structured-outputs.js "Quantum Computing"
```

---

### 4. Handling Images and Files (`4-handling-images-files.js`)

Shows how to work with images and files in AI models.

**Features:**
- Analyze images from URLs
- Process local image files
- Multi-image comparison
- Document/PDF processing
- Image-to-structured-data conversion

**Usage:**
```bash
node examples/4-handling-images-files.js ./path/to/image.png ./path/to/document.txt
```

---

### 5. Tool Calling (`5-tool-calling.js`)

Demonstrates function calling capabilities (tools).

**Features:**
- Basic tool calling
- Educational assistant with multiple tools
- Streaming with tool calls
- Tool execution logging

**Usage:**
```bash
node examples/5-tool-calling.js "Neural Networks"
```

---

### 6. Building Agents (`6-building-agents.js`)

Shows how to build autonomous AI agents.

**Features:**
- Autonomous learning agent
- Multi-agent systems
- Goal-oriented agents with reasoning
- Adaptive agents that learn from interactions

**Usage:**
```bash
node examples/6-building-agents.js "React Hooks" intermediate
```

---

### 7. Message History (`7-message-history.js`)

Demonstrates conversation management using CoreMessage type.

**Features:**
- Basic conversation with history
- System messages for role definition
- Tool usage with conversation history
- Conversation summarization
- Interactive conversation loop (optional)

**Usage:**
```bash
node examples/7-message-history.js
```

---

### 8. Local AI Models (`8-local-ai-models.js`)

Shows how to connect to locally running AI models.

**Features:**
- Connect to Ollama
- Connect to LM Studio
- Connect to LocalAI
- Custom local model configuration
- Comparison between local and cloud models

**Setup:**

1. **Ollama:**
   ```bash
   # Install from https://ollama.ai/download
   ollama serve
   ollama pull llama2
   ```

2. **LM Studio:**
   - Install from https://lmstudio.ai/
   - Load a model and start the server on port 1234

3. **LocalAI:**
   ```bash
   docker run -p 8080:8080 localai/localai
   ```

**Usage:**
```bash
node examples/8-local-ai-models.js
```

---

### 9. Classification Analysis (`9-classification-analysis.js`)

Demonstrates classification tasks using enums.

**Features:**
- Sentiment analysis
- Content categorization
- Difficulty assessment
- Code quality analysis
- Learning style classification
- Multi-label classification
- Intent classification

**Usage:**
```bash
node examples/9-classification-analysis.js
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Local Model (optional)
LOCAL_MODEL_URL=http://localhost:8000/v1
LOCAL_MODEL_API_KEY=your_local_api_key
```

## Running All Examples

To run a specific example:

```bash
node examples/1-hot-swapping-models.js
```

To run with different parameters:

```bash
node examples/1-hot-swapping-models.js "Your Topic" model-provider
```

## Key Concepts

### Structured Outputs with Zod

All examples use Zod for schema validation:

```javascript
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  items: z.array(z.string()),
  category: z.enum(['tech', 'science', 'business']),
});
```

### Message History with CoreMessage

Maintain conversation context:

```javascript
const messages = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help?' },
];
```

### Tool Calling

Define tools for the AI to use:

```javascript
const tools = {
  getWeather: {
    description: 'Get weather for a location',
    parameters: z.object({
      location: z.string(),
    }),
    execute: async ({ location }) => {
      // Implementation
    },
  },
};
```

### Streaming

Stream responses in real-time:

```javascript
const result = streamText({ model, prompt });

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}
```

## Troubleshooting

### "Module not found" errors
```bash
pnpm install
```

### "API key not found" errors
Check your `.env` file and ensure it's in the root directory.

### Local model connection errors
Make sure the local model server is running:
- Ollama: `ollama serve`
- LM Studio: Start server in the UI
- LocalAI: Check Docker container status

### ESLint warnings about "use" prefix
The examples use function names like `connectToOllama` instead of `useOllama` to avoid React Hook naming conflicts.

## Additional Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Zod Documentation](https://zod.dev/)

## License

MIT
