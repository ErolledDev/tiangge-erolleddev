'use client';

import React from 'react';

export default function StoreFooter() {
  return (
    // Updated vertical padding to 'py-8' for more space on top and bottom
    <footer className="bg-white py-8 text-center text-gray-600">
      <div className="space-y-3">
        {/* Tiangge Heading */}
        <div>
          <p className="text-xl font-bold text-gray-700">
            Tiangge
          </p>
        </div>
      </div>
    </footer>
  );
}