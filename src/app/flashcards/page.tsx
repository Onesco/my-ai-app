'use client';

import { useState, useEffect, Suspense } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const flashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  hint: z.string(),
});

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get('topic');

  const [topic, setTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { object, submit, isLoading } = useObject({
    api: '/api/flashcards',
    schema: z.array(flashcardSchema),
  });

  // Auto-generate flashcards if topic is passed via URL
  useEffect(() => {
    if (topicFromUrl && !isLoading && !object) {
      setTopic(topicFromUrl);
      submit({ topic: topicFromUrl });
    }
  }, [topicFromUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
    submit({ topic });
  };

  const flashcards = object || [];
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
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
            AI Flashcard Generator
          </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'JavaScript basics', 'World War 2')"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Creating flashcards...</p>
          </div>
        )}

        {!isLoading && flashcards.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 min-h-[400px] flex flex-col">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-6">
                {/* Question */}
                <div className="text-center">
                  <h3 className="text-sm uppercase tracking-wide text-pink-600 dark:text-pink-400 mb-4">
                    Question
                  </h3>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {currentCard?.question}
                  </p>
                </div>

                {/* Hint Button */}
                {!showAnswer && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          💡 {currentCard?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show Answer Button */}
                <div className="text-center">
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>

                {/* Answer */}
                {showAnswer && (
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-sm uppercase tracking-wide text-green-600 dark:text-green-400 mb-3">
                      Answer
                    </h3>
                    <p className="text-xl text-gray-700 dark:text-gray-200">
                      {currentCard?.answer}
                    </p>
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
                {flashcards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowAnswer(false);
                      setShowHint(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex
                        ? 'bg-pink-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}
