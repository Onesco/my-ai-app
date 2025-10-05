'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const slideSchema = z.object({
  title: z.string(),
  keyPoints: z.array(z.string()),
  detailedExplanation: z.string(),
  example: z.string(),
  relatedConcepts: z.array(z.string()),
});

export default function SlideGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const { object, submit, isLoading } = useObject({
    api: '/api/slide-generator',
    schema: z.array(slideSchema),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setCurrentIndex(0);
    setShowDetails(false);
    submit({ topic });
  };

  const slides = object || [];
  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
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

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            AI Slide Generator
          </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'JavaScript basics', 'World War 2')"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Creating slides...</p>
          </div>
        )}

        {!isLoading && slides.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Slide {currentIndex + 1} of {slides.length}
                </span>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                  {currentSlide?.title}
                </h2>

                {/* Key Points */}
                {currentSlide?.keyPoints && currentSlide.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {currentSlide.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show/Hide Details Button */}
                <div className="text-center">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {/* Details Section (Hidden by default) */}
                {showDetails && (
                  <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Detailed Explanation */}
                    {currentSlide?.detailedExplanation && (
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                          Explanation
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentSlide.detailedExplanation}
                        </p>
                      </div>
                    )}

                    {/* Example */}
                    {currentSlide?.example && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                          Example
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentSlide.example}
                        </p>
                      </div>
                    )}

                    {/* Related Concepts */}
                    {currentSlide?.relatedConcepts && currentSlide.relatedConcepts.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                          Related Concepts
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentSlide.relatedConcepts.map((concept, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowDetails(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex
                        ? 'bg-indigo-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {currentIndex === slides.length - 1 ? (
                <button
                  onClick={() => router.push(`/flashcards?topic=${encodeURIComponent(topic)}`)}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  Generate Flashcards →
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
