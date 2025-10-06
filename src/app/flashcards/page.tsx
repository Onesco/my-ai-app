'use client';

import { useState, useEffect, Suspense } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

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
      <Navigation />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-white">
            AI Flashcard Generator
          </h1>

        <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'JavaScript basics')"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:bg-gray-400 min-h-[48px]"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px] flex flex-col">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
                {/* Question */}
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm uppercase tracking-wide text-pink-600 dark:text-pink-400 mb-3 sm:mb-4">
                    Question
                  </h3>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white px-2">
                    {currentCard?.question}
                  </p>
                </div>

                {/* Hint Button */}
                {!showAnswer && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm min-h-[44px]"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mx-2">
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
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
                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold min-h-[48px]"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>

                {/* Answer */}
                {showAnswer && (
                  <div className="text-center p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-lg mx-2">
                    <h3 className="text-xs sm:text-sm uppercase tracking-wide text-green-600 dark:text-green-400 mb-2 sm:mb-3">
                      Answer
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-200">
                      {currentCard?.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-3 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px]"
              >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">←</span>
              </button>

              <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-[150px] sm:max-w-none">
                {flashcards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowAnswer(false);
                      setShowHint(false);
                    }}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors flex-shrink-0 ${
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
                className="px-3 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px]"
              >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden">→</span>
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
