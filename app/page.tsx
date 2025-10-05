'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ArrowRight, Star, StarHalf, RefreshCw, AtSign, Lock, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-emerald-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Tiangge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Content */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Create Your
              <span className="text-emerald-600 block">Affiliate Store</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build and customize your own affiliate store. Add products, create promotional slides, and start earning commissions through affiliate marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                View Demo Store
              </Link>
            </div>
          </div>

          {/* Phone Mockup with Floating Cards */}
          <div className="relative flex justify-center items-center min-h-[900px] lg:min-h-[1000px]">
            {/* Floating Metric Cards Container */}
            <div className="absolute inset-0 hidden md:flex justify-center items-center pointer-events-none">
              <div className="relative w-full h-full max-w-[800px] lg:max-w-[1000px]">
                {/* Top Left - Affiliate Earnings */}
                <div className="absolute top-[8%] left-[5%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-6">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-2 text-emerald-600">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 flex-shrink-0" />
                    <span>$2,250</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Affiliate Earnings</div>
                </div>

                {/* Top Right - Store Visits */}
                <div className="absolute top-[8%] right-[5%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-1">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-2 text-emerald-600">
                    <Store className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 flex-shrink-0" />
                    <span>9,800</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Store Visits</div>
                </div>

                {/* Middle Left - Total Clicks */}
                <div className="absolute top-[35%] left-[2%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-2">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-2 text-emerald-600">
                    <MousePointer className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 flex-shrink-0" />
                    <span>3,450</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Total Clicks</div>
                </div>

                {/* Middle Right - Conversion Rate */}
                <div className="absolute top-[35%] right-[2%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-4">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-2 text-emerald-600">
                    <RefreshCw className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 flex-shrink-0" />
                    <span>12%</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Conversion Rate</div>
                </div>

                {/* Bottom Left - Average Rating */}
                <div className="absolute bottom-[15%] left-[5%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-3">
                  <div className="flex items-center text-base lg:text-lg xl:text-xl font-bold mb-2">
                    <div className="flex text-yellow-400 mr-2 flex-shrink-0">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-current" />
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-current" />
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-current" />
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-current" />
                      <StarHalf className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-current" />
                    </div>
                    <span className="text-emerald-600 text-lg lg:text-xl xl:text-2xl font-extrabold">4.5</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Average Rating</div>
                </div>

                {/* Bottom Right - Product Views */}
                <div className="absolute bottom-[15%] right-[5%] w-36 lg:w-44 xl:w-48 bg-white/95 backdrop-blur-sm border-2 border-white/80 rounded-xl p-4 lg:p-5 text-left shadow-2xl z-10 transform hover:scale-105 transition-all duration-300 pointer-events-auto animate-float-5">
                  <div className="flex items-center text-lg lg:text-xl xl:text-2xl font-bold mb-2 text-emerald-600">
                    <Eye className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-2 flex-shrink-0" />
                    <span>5,600</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-700 font-medium">Product Views</div>
                </div>

                {/* Central Phone Mockup */}
                <div className="relative z-30 w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
                  <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-800/50">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
                      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden h-[600px] lg:h-[700px] xl:h-[800px]">
                        {/* Phone Content */}
                        <div className="text-center pt-6 lg:pt-8 py-0 px-4 scale-90 lg:scale-95 origin-top">
                          {/* Store Avatar */}
                          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
                            <Store className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                          </div>

                          {/* Social Icons */}
                          <div className="flex justify-center space-x-3 mb-3">
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div className="w-5 h-5 text-gray-700">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                          </div>

                          {/* Store Name and Description */}
                          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">The Coffee Maker</h2>
                          <p className="text-sm text-gray-600 mb-4">Welcome to my awesome store! Discover unique products curated just for you.</p>
                        </div>

                        {/* Categories */}
                        <div className="px-4 mb-4">
                          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1">
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden border-2 border-emerald-500 grid grid-cols-2 grid-rows-2 gap-0">
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full h-full">
                                  <img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-emerald-600">All</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Fashion</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Health</p>
                            </div>
                            <div className="flex-shrink-0 mx-1">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-center mt-1 font-medium text-gray-600">Office</p>
                            </div>
                          </div>
                        </div>

                        {/* Products Section */}
                        <div className="px-4 pb-8">
                          <h3 className="text-sm font-bold text-gray-900 mb-3">All Products</h3>
                          
                          {/* Search Bar */}
                          <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.34-4.34M11 19a8 8 0 100-16 8 8 0 000 16z" />
                              </svg>
                            </div>
                            <input
                              placeholder="Search products..."
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-xs bg-white text-gray-900 placeholder-gray-500"
                              readOnly
                              type="text"
                            />
                          </div>

                          {/* Product Grid */}
                          <div className="grid grid-cols-3 gap-2 lg:gap-3">
                            {[
                              { name: 'Wireless Headphones', price: '$149.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
                              { name: 'Smart Watch Pro', price: '$299.99', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop' },
                              { name: 'Designer Backpack', price: '$89.99', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop' },
                              { name: 'Sunglasses', price: '$129.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
                              { name: 'Laptop Computer', price: '$999.99', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200&h=200&fit=crop' },
                              { name: 'Bluetooth Speaker', price: '$79.99', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=200&h=200&fit=crop' }
                            ].map((product, index) => (
                              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                <div className="aspect-square overflow-hidden">
                                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-2">
                                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                                  <p className="text-xs font-bold text-emerald-600">{product.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to build, customize, and grow your affiliate marketing business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: 'Custom Store Builder',
                description: 'Create a beautiful, professional store with our easy-to-use customization tools.'
              },
              {
                icon: Package,
                title: 'Product Management',
                description: 'Add unlimited products with bulk import, auto-scraping, and advanced organization.'
              },
              {
                icon: TrendingUp,
                title: 'Analytics Dashboard',
                description: 'Track performance with detailed insights on clicks, views, and conversions.'
              },
              {
                icon: Users,
                title: 'Customer Engagement',
                description: 'Build your audience with email subscriptions and promotional tools.'
              },
              {
                icon: Eye,
                title: 'SEO Optimized',
                description: 'Get found on search engines with built-in SEO optimization and meta tags.'
              },
              {
                icon: MousePointer,
                title: 'Click Tracking',
                description: 'Monitor every interaction to optimize your store for maximum conversions.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliate marketers who are already earning with Tiangge.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Create Your Store Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Store className="w-8 h-8 text-emerald-400 mr-3" />
                <span className="text-xl font-bold">Tiangge</span>
              </div>
              <p className="text-gray-400 mb-4">
                The easiest way to create and manage your affiliate store. Start earning commissions today.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Tiangge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
