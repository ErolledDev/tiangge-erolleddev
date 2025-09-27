'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import { checkSlugAvailability } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { Store, Package, TrendingUp, Users, Eye, MousePointer, ChartBar as BarChart3, ShoppingBag, Star, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const checkSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugError('Store URL must be at least 3 characters long');
      return;
    }

    setIsCheckingSlug(true);
    try {
      const isAvailable = await checkSlugAvailability(slug);
      if (!isAvailable) {
        setSlugError('This store URL is already taken. Please choose a different one.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Error checking URL availability');
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleStoreSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setStoreSlug(value);
    
    // Debounce slug checking
    const timeoutId = setTimeout(() => checkSlug(value), 500);
    return () => clearTimeout(timeoutId);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!isLogin) {
      let error = '';
      try {
        if (value) {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters long';
          } else if (!/[A-Z]/.test(value)) {
            error = 'Password must contain at least one uppercase letter';
          } else if (!/[a-z]/.test(value)) {
            error = 'Password must contain at least one lowercase letter';
          } else if (!/\d/.test(value)) {
            error = 'Password must contain at least one number';
          } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            error = 'Password must contain at least one special character';
          }
        }
      } catch (err: any) {
        error = err.message;
      }
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin) {
      if (passwordError) {
        setError('Please fix the password requirements');
        setLoading(false);
        return;
      }
      if (slugError) {
        setError('Please fix the store URL error');
        setLoading(false);
        return;
      }
      if (!storeSlug.trim()) {
        setError('Store URL is required');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName, storeSlug);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Column - Visual Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Tiangge</h1>
                <p className="text-primary-100">Affiliate Store Builder</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Build Your Dream<br />
              <span className="text-secondary-200">Affiliate Store</span>
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed">
              Create stunning affiliate stores, track performance, and earn commissions with our powerful platform.
            </p>
          </div>

          {/* Mock Dashboard Preview */}
          <div className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-200" />
                  </div>
                  <span className="text-xs text-primary-200">+12%</span>
                </div>
                <div className="text-2xl font-bold text-white">2,847</div>
                <div className="text-sm text-primary-200">Product Clicks</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-200" />
                  </div>
                  <span className="text-xs text-primary-200">+8%</span>
                </div>
                <div className="text-2xl font-bold text-white">1,234</div>
                <div className="text-sm text-primary-200">Store Views</div>
              </div>
            </div>

            {/* Product Cards Preview */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Top Products</h3>
                <Package className="w-5 h-5 text-primary-200" />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Wireless Headphones', price: '$99', color: 'bg-blue-500' },
                  { name: 'Smart Watch', price: '$249', color: 'bg-purple-500' },
                  { name: 'Phone Case', price: '$29', color: 'bg-pink-500' }
                ].map((product, index) => (
                  <div key={index} className="bg-white bg-opacity-15 rounded-lg p-3 border border-white border-opacity-20">
                    <div className={`w-full h-16 ${product.color} bg-opacity-30 rounded-lg mb-2 flex items-center justify-center`}>
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-medium text-white truncate">{product.name}</div>
                    <div className="text-xs text-primary-200">{product.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                { icon: BarChart3, text: 'Real-time Analytics Dashboard' },
                { icon: Users, text: 'Email Subscriber Management' },
                { icon: MousePointer, text: 'Click Tracking & Performance' },
                { icon: Star, text: 'Custom Branding & Themes' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-primary-100">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Tiangge</h1>
                <p className="text-gray-600">Affiliate Store Builder</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back!' : 'Get started today'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin ? 'Sign in to access your affiliate store dashboard' : 'Create your account and start building your affiliate empire'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required={!isLogin}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              )}
              
              {!isLogin && (
                <div>
                  <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL
                  </label>
                  <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                    <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                      tiangge.shop/
                    </span>
                    <input
                      id="storeSlug"
                      name="storeSlug"
                      type="text"
                      required={!isLogin}
                      className={`flex-1 px-3 py-3 rounded-r-lg focus:outline-none ${
                        slugError ? 'border-red-300' : ''
                      }`}
                      placeholder="my-store"
                      value={storeSlug}
                      onChange={handleStoreSlugChange}
                    />
                  </div>
                  {isCheckingSlug && (
                    <p className="mt-2 text-sm text-gray-500 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Checking availability...
                    </p>
                  )}
                  {slugError && (
                    <p className="mt-2 text-sm text-red-600">{slugError}</p>
                  )}
                  {!slugError && !isCheckingSlug && storeSlug && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      Store URL is available
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {!isLogin && passwordError && (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
                {!isLogin && !passwordError && password && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Password meets requirements
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!isLogin && (slugError !== '' || passwordError !== '' || isCheckingSlug))}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? 'Sign in to Dashboard' : 'Create Your Store'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-gray-600">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Features Preview for Mobile */}
          <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BarChart3, text: 'Analytics Dashboard', color: 'bg-blue-100 text-blue-600' },
                { icon: Package, text: 'Product Management', color: 'bg-green-100 text-green-600' },
                { icon: Users, text: 'Subscriber System', color: 'bg-purple-100 text-purple-600' },
                { icon: Star, text: 'Custom Branding', color: 'bg-yellow-100 text-yellow-600' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
