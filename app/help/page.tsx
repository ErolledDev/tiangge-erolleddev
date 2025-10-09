'use client';

import Link from 'next/link';
import { Store, ArrowLeft, Search, Book, MessageCircle, Settings, BarChart3, Package, Image, Users } from 'lucide-react';
import HomeFooter from '@/components/HomeFooter';

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: Settings,
      title: 'Getting Started',
      description: 'Learn the basics of setting up your store',
      articles: [
        'How to create your first store',
        'Customizing your store appearance',
        'Adding social media links',
        'Understanding user roles'
      ]
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Managing your affiliate products',
      articles: [
        'Adding products manually',
        'Using product URL scraping',
        'Importing products via CSV',
        'Managing product categories'
      ]
    },
    {
      icon: Image,
      title: 'Content & Design',
      description: 'Creating engaging content',
      articles: [
        'Creating promotional slides',
        'Using custom HTML sections',
        'Adding floating widgets',
        'Setting up pop-up banners'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Understanding your store performance',
      articles: [
        'Reading your analytics dashboard',
        'Tracking product clicks',
        'Understanding visitor behavior',
        'Exporting analytics data'
      ]
    },
    {
      icon: Users,
      title: 'Subscriber Management',
      description: 'Building your email list',
      articles: [
        'Enabling subscription forms',
        'Managing subscribers',
        'Exporting subscriber data',
        'Best practices for email marketing'
      ]
    },
    {
      icon: Book,
      title: 'Premium Features',
      description: 'Get the most from Premium',
      articles: [
        'Premium vs Standard features',
        'Upgrading to Premium',
        'Bulk import capabilities',
        'Advanced customization options'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Store className="w-8 h-8 text-emerald-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Tiangge</span>
            </Link>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of your Tiangge store
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm">
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-emerald-50 rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to assist you with any questions
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
