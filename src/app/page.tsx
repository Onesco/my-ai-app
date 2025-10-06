'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center">My AI App</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full">
        <Link
          href="/generate-image"
          className="p-6 sm:p-8 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center min-h-[140px] flex flex-col items-center justify-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Image Generator</h2>
          <p className="text-sm sm:text-base">Generate images with DALL-E 3</p>
        </Link>

        <Link
          href="/slide-generator"
          className="p-6 sm:p-8 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-center min-h-[140px] flex flex-col items-center justify-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Slide Generator</h2>
          <p className="text-sm sm:text-base">Create educational slides with AI</p>
        </Link>

        <Link
          href="/flashcards"
          className="p-6 sm:p-8 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-center min-h-[140px] flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Flashcards</h2>
          <p className="text-sm sm:text-base">Study with AI-powered flashcards</p>
        </Link>
      </div>
    </div>
  );
}
