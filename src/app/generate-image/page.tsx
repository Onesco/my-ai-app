'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GenerateImagePage() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setImagePrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/generate-image"
            className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            Image Generator
          </Link>
          <Link
            href="/slide-generator"
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            Slide Generator
          </Link>
          <Link
            href="/flashcards"
            className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            Flashcards
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>

        <form onSubmit={handleGenerateImage} className="mb-6 flex gap-2">
          <input
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {generatedImage && (
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <Image
              src={generatedImage}
              alt="Generated image"
              width={1024}
              height={1024}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
