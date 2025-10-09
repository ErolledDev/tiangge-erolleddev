'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-white mt-0 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center text-gray-600">
      <div className="space-y-3 sm:space-y-4">
        {/* Tagline */}
        <div>
          <p className="text-sm text-gray-300">
            Powered by <span className="font-semibold text-gray-600">Tiangge</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
