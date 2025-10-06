'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
            My AI App
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex gap-4">
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
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/generate-image"
              className="px-4 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Image Generator
            </Link>
            <Link
              href="/slide-generator"
              className="px-4 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Slide Generator
            </Link>
            <Link
              href="/flashcards"
              className="px-4 py-3 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Flashcards
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
