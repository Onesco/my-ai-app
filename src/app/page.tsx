'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">My AI App</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <Link
          href="/generate-image"
          className="p-8 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Image Generator</h2>
          <p>Generate images with DALL-E 3</p>
        </Link>

        <Link
          href="/slide-generator"
          className="p-8 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Slide Generator</h2>
          <p>Create educational slides with AI</p>
        </Link>

        <Link
          href="/flashcards"
          className="p-8 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Flashcards</h2>
          <p>Study with AI-powered flashcards</p>
        </Link>
      </div>
    </div>
  );
}
