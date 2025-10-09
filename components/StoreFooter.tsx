'use client';

import React from 'react';
import { Store } from 'lucide-react';

export default function StoreFooter() {
  return (
    <footer className="bg-white mt-0 pt-12 pb-12 px-4 sm:px-6">
      <div className="flex justify-center items-center">
        <p className="text-2xl text-gray-500 flex items-center">
          Powered by{' '}
          <span className="font-semibold text-gray-700 flex items-center ml-1">
            <Store className="w-8 h-8 mr-1 text-emerald-600" />
            Tiangge
          </span>
        </p>
      </div>
    </footer>
  );
}
