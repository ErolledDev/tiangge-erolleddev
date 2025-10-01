'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ArrowRight, Star, ChartBar as BarChart3, Settings, Globe, Zap, Instagram, Facebook, Twitter, Search } from 'lucide-react';

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