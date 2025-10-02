'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ArrowRight, Star, ChartBar as BarChart3, Settings, Globe, Zap, Instagram, Facebook, Twitter, Search, Palette, Link2, Upload, FileSpreadsheet } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <Store className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" />
                <div className="absolute -inset-1 bg-emerald-100 rounded-full opacity-30 animate-ping"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-700 bg-clip-text text-transparent">Tiangge</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/auth');
                }}
                className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:underline underline-offset-4"
              >
                Log in
              </a>
              <button
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Create Your<br className="sm:hidden" /> Online<br />Affiliate Store<br />in Minutes
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Effortlessly build and customize your affiliate storefront. Curate products, design compelling promotions, and unlock revenue streams with seamless integration.
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="group inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-emerald/20 transform hover:scale-105"
            >
              GET STARTED
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="relative flex justify-center items-center min-h-[800px] lg:min-h-[900px]">
            {/* Floating Product Cards - Responsive Grid with Transforms - Hidden on Mobile */}
            <div className="absolute inset-0 hidden md:flex flex-col lg:flex-row justify-between items-center pointer-events-none xl:pointer-events-auto px-2 sm:px-8 md:px-12 lg:px-16">
              {/* Left Side Cards */}
              <div className="flex flex-col space-y-4 sm:space-y-8 pointer-events-auto -ml-8 sm:ml-0">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105 group pointer-events-auto w-36 sm:w-48 h-52 sm:h-64 mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=face"
                    alt="Premium Wireless Headphones"
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">Premium Wireless Headphones</h3>
                    <p className="text-base font-bold text-emerald-600">$149.99</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 group pointer-events-auto w-36 sm:w-48 h-52 sm:h-64 mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
                    alt="Designer Backpack"
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">Designer Backpack Collection</h3>
                    <p className="text-base font-bold text-emerald-600">$89.99</p>
                  </div>
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="flex flex-col space-y-4 sm:space-y-8 pointer-events-auto mt-20 sm:mt-0 -mr-8 sm:mr-0">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105 group pointer-events-auto w-36 sm:w-48 h-52 sm:h-64 mx-auto order-last sm:order-first">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop"
                    alt="Smart Watch Pro"
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">Smart Watch Pro Series</h3>
                    <p className="text-base font-bold text-emerald-600">$299.99</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 group pointer-events-auto w-36 sm:w-48 h-52 sm:h-64 mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=300&h=300&fit=crop"
                    alt="Portable Speaker"
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">Portable Bluetooth Speaker</h3>
                    <p className="text-base font-bold text-emerald-600">$79.99</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Device Mockup - Responsive */}
            <div className="relative z-30 w-full max-w-md mx-auto transform scale-90 sm:scale-100">
              <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-800/50">
                <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
                  <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden" style={{ height: '600px', minHeight: '600px' }}>
                    {/* Mockup Content - Scaled down for fit */}
                    <div className="text-center pt-8 py-0 px-4 scale-90 origin-top">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex justify-center space-x-3 mb-2">
                        <Instagram className="w-5 h-5 text-gray-700" />
                        <Facebook className="w-5 h-5 text-gray-700" />
                        <Twitter className="w-5 h-5 text-gray-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">The Coffee Maker</h2>
                      <p className="text-sm text-gray-600 mb-1">Welcome to my awesome store! Discover unique products curated just for you.</p>

                      
                    </div>

                    <div className="px-4 mb-2">
                      <div className="flex space-x-1 overflow-x-auto pb-2 -mx-1">
                        {[
                          { name: 'All', images: [
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
                            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop',
                            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=100&h=100&fit=crop'
                          ], isGrid: true },
                          { name: 'Fashion', images: [
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
                          ], isGrid: false },
                          { name: 'Health', images: [
                            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
                          ], isGrid: false },
                          { name: 'Office', images: [
                            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=100&h=100&fit=crop'
                          ], isGrid: false }
                        ].map((cat) => (
                          <div key={cat.name} className="flex-shrink-0 mx-1">
                            <div className={`w-16 h-16 rounded-full shadow-md overflow-hidden ${cat.name === 'All' ? 'border-2 border-emerald-500' : 'bg-gray-200'} ${cat.isGrid ? 'grid grid-cols-2 grid-rows-2 gap-0' : ''}`}>
                              {cat.isGrid ? (
                                cat.images.map((img, idx) => (
                                  <div key={idx} className="w-full h-full">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  </div>
                                ))
                              ) : (
                                <img src={cat.images[0]} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <p className={`text-xs text-center mt-1 font-medium ${cat.name === 'All' ? 'text-emerald-600' : 'text-gray-600'}`}>{cat.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-4 pb-8">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">All Products</h3>
                      
                      {/* Search Input */}
                      <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-xs bg-white text-gray-900 placeholder-gray-500"
                          readOnly
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', name: 'Wireless Headphones', price: '149.99' },
                          { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop', name: 'Smart Watch Pro', price: '299.99' },
                          { img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop', name: 'Designer Backpack', price: '89.99' },
                          { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', name: 'Sunglasses', price: '129.99' },
                          { img: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200&h=200&fit=crop', name: 'Laptop Computer', price: '999.99' },
                          { img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=200&h=200&fit=crop', name: 'Bluetooth Speaker', price: '79.99' }
                        ].map((product, i) => (
                          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-square overflow-hidden">
                              <img src={product.img} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                              <p className="text-xs font-bold text-emerald-600">${product.price}</p>
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
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Powerful Tools to Build Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, customize, and grow your affiliate store with ease
            </p>
          </div>

          <div className="space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Analytics Dashboard</h3>
                      <BarChart3 className="w-6 h-6 text-emerald-600" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <Eye className="w-5 h-5 text-blue-600" />
                          <span className="text-xs font-semibold text-green-600">+12%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">2,847</p>
                        <p className="text-xs text-gray-600">Total Views</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          <span className="text-xs font-semibold text-green-600">+8%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">1,243</p>
                        <p className="text-xs text-gray-600">Clicks</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <Package className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-semibold text-green-600">+18%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">87</p>
                        <p className="text-xs text-gray-600">Products</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Traffic Over Time</span>
                        <span className="text-xs text-gray-500">Last 7 days</span>
                      </div>
                      <div className="flex items-end justify-between h-32 gap-2">
                        {[40, 65, 50, 80, 95, 70, 85].map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-500"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Analytics & Insights</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Track your store's performance with real-time analytics. Monitor visitor traffic, product clicks,
                  and engagement metrics to understand what drives your success and optimize your affiliate strategy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Real-time visitor tracking and engagement metrics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Product performance and conversion analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Interactive charts and visual data reports</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Store Customization</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Make your store uniquely yours with powerful customization tools. Personalize colors, layouts,
                  branding, and every visual element to match your brand identity and stand out from the competition.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Custom colors, fonts, and theme configurations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Logo upload and brand identity controls</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Social media links and custom bio sections</span>
                  </li>
                </ul>
              </div>

              <div className="order-2">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Customize Your Store</h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Brand Colors</label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Primary</span>
                              <div className="w-10 h-10 bg-emerald-600 rounded-lg border-2 border-white shadow-md"></div>
                            </div>
                          </div>
                          <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Accent</span>
                              <div className="w-10 h-10 bg-purple-600 rounded-lg border-2 border-white shadow-md"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Store Name</label>
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <input
                            type="text"
                            value="My Awesome Store"
                            readOnly
                            className="w-full text-sm text-gray-900 border-none focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Store Preview</label>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">My Awesome Store</p>
                              <p className="text-xs text-gray-600">Your personalized storefront</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Import Products Instantly</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Enter Product URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value="https://example.com/wireless-headphones"
                          readOnly
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-emerald-300 rounded-xl text-sm text-gray-700 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="flex items-center justify-center mt-3">
                        <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                          Scrape Product
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        Auto-filled
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-emerald-200">
                        <div className="flex space-x-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1 text-sm">Premium Wireless Headphones</h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              High-quality wireless headphones with active noise cancellation and premium sound quality
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-emerald-600">$149.99</p>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Electronics</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Product Scraping & Import</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Add products to your store in seconds. Simply paste any product URL and let our intelligent scraper
                  automatically extract all the details including title, description, price, images, and category.
                  You can also bulk import products using CSV files.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">One-click product scraping from any URL</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Automatic extraction of product details and images</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Bulk import with CSV file support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">CSV Bulk Import</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Save time by importing multiple products at once with CSV files. Upload hundreds of products
                  in seconds with our smart validation system that ensures data quality before import.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Import unlimited products with a single CSV file</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Smart validation catches errors before import</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Download CSV template to get started quickly</span>
                  </li>
                </ul>
              </div>

              <div className="order-2">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                      <span>Bulk CSV Import</span>
                      <Upload className="w-5 h-5 text-teal-600" />
                    </h3>

                    <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors cursor-pointer group mb-6">
                      <div className="flex flex-col items-center justify-center py-3">
                        <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors mb-3">
                          <FileSpreadsheet className="w-8 h-8 text-teal-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload CSV file</p>
                        <p className="text-xs text-gray-600">or drag and drop</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-900">Import Successful!</p>
                          <p className="text-xs text-green-700">Successfully imported 20 products</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700">Imported Products (showing 3 of 20)</p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { name: 'Wireless Bluetooth Headphones', price: '$99.99', category: 'Electronics' },
                          { name: 'Organic Cotton T-Shirt', price: '$29.99', category: 'Fashion' },
                          { name: 'Stainless Steel Water Bottle', price: '$24.99', category: 'Home & Garden' }
                        ].map((product, i) => (
                          <div key={i} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-600">{product.category}</p>
                              </div>
                              <span className="ml-3 text-sm font-bold text-teal-600">{product.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-600">+ 17 more products imported</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">SEO Performance</h3>
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-6">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook Open Graph Preview
                        </p>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="aspect-[1.91/1] bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                  <span className="text-white font-bold text-3xl">M</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-8">
                                  <div className="w-16 h-16 bg-white/80 rounded-lg shadow-md"></div>
                                  <div className="w-16 h-16 bg-white/80 rounded-lg shadow-md"></div>
                                  <div className="w-16 h-16 bg-white/80 rounded-lg shadow-md"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-xs text-gray-500 uppercase mb-1">YOURSTORE.EXAMPLE.COM</p>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                              My Awesome Store - Premium Products & Affiliate Deals
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              Discover curated products and exclusive deals. Shop electronics, fashion, home goods, and more from trusted brands.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <Search className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-900">Search Engine Preview</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Globe className="w-3 h-3" />
                          <span>yourstore.example.com</span>
                        </div>
                        <h4 className="text-blue-700 text-sm font-medium hover:underline cursor-pointer">
                          My Awesome Store - Premium Products & Affiliate Deals
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Discover curated products and exclusive deals. Shop electronics, fashion, home goods, and more from trusted brands with our affiliate recommendations.
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <span className="font-medium">Rich Snippets:</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">⭐ 4.8 Rating</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">87 Products</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">SEO Optimized Stores</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Your store is automatically optimized for search engines from day one. Built-in SEO best practices ensure
                  maximum visibility and higher rankings on Google, driving organic traffic to your affiliate products.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Automatic meta tags, titles, and descriptions for every page</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Structured data markup for rich search results</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Lightning-fast page loads and mobile optimization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Automatic sitemap generation for better crawling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-emerald-50/80 to-white/80 p-8 rounded-2xl border border-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Store Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Tailor every aspect of your store with intuitive tools for branding, layouts, and themes that resonate with your audience.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50/80 to-white/80 p-8 rounded-2xl border border-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly import and organize affiliate products with AI-assisted scraping, rich media support, and effortless categorization.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50/80 to-white/80 p-8 rounded-2xl border border-emerald-100/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Gain actionable insights into traffic, engagement, and conversions with real-time metrics and predictive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive suite of premium features designed to elevate your affiliate business to new heights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Settings, title: 'Advanced Customization', desc: 'Unlock unlimited possibilities with pro-level theming, dynamic components, and code injection for bespoke experiences.' },
              { icon: Globe, title: 'SEO Optimized', desc: 'Dominate search rankings with automated schema markup, sitemap generation, and performance-tuned architecture.' },
              { icon: TrendingUp, title: 'Promotional Engine', desc: 'Drive urgency with A/B tested banners, countdown timers, and personalized recommendation algorithms.' },
              { icon: Users, title: 'Audience Builder', desc: 'Nurture leads through integrated email automation, segmentation, and loyalty programs that convert.' },
              { icon: MousePointer, title: 'Precision Tracking', desc: 'Capture every interaction with pixel-perfect attribution, heatmaps, and cohort analysis for data-driven decisions.' },
              { icon: Zap, title: 'Scalable Imports', desc: 'Handle enterprise volumes with bulk API integrations, error-resilient processing, and scheduled automations.' }
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="group p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Launch in Four Effortless Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From concept to commissions—your path to affiliate mastery, simplified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative">
            {[
              { num: 1, title: 'Sign Up', desc: 'Secure your branded domain and unlock instant access to the platform.' },
              { num: 2, title: 'Design', desc: 'Configure visuals, themes, and UX with drag-and-drop precision.' },
              { num: 3, title: 'Populate', desc: 'Source and style products with smart imports and AI enhancements.' },
              { num: 4, title: 'Monetize', desc: 'Deploy, promote, and watch commissions flow in real-time.' }
            ].map(({ num, title, desc }, i) => (
              <div key={i} className="text-center group relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
                {i < 3 && (
                  <div className="absolute top-1/2 -right-6 hidden md:block transform -translate-y-1/2 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Accelerate Your Affiliate Empire Today
          </h2>
          <p className="text-2xl text-emerald-100 mb-10 leading-relaxed">
            Join elite creators generating six-figure revenues with Tiangge's enterprise-grade platform.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="group inline-flex items-center bg-white text-emerald-700 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 transform hover:scale-105"
          >
            Launch Free Trial
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <Store className="w-8 h-8 text-emerald-500" />
                <span className="text-2xl font-bold text-white">Tiangge</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering creators to craft high-converting affiliate stores with unparalleled ease and sophistication.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Core Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Enterprise Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">API Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Our Vision</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Insights Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Legal Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 block py-1">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 Tiangge. Crafted with precision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}