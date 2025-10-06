# My AI App

An AI-powered educational application built with Next.js featuring three intelligent tools:

## Features

- **Image Generator** - Generate images using DALL-E 3
- **Slide Generator** - Create educational slides with AI assistance
- **Flashcards** - Study with AI-powered flashcards that include questions, hints, and answers

## Tech Stack

- **Next.js 15.5.4** with React 19
- **Vercel AI SDK** (`@ai-sdk/openai`, `@ai-sdk/react`)
- **TypeScript**
- **Tailwind CSS** for styling
- **Zod** for schema validation

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

Create a `.env.local` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to see the app

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── flashcards/      # AI flashcard generator
│   ├── slide-generator/ # Educational slide creator
│   ├── generate-image/  # DALL-E 3 image generator
│   └── api/             # API routes
└── components/          # Shared components
```

## Deploy on Vercel

The easiest way to deploy this app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your `OPENAI_API_KEY` environment variable in your Vercel project settings.
