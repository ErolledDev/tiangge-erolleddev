'use client';

import React, { useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { checkCustomDomainAvailability } from '@/lib/store';
import { Search, Globe, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, ArrowLeft, Database, Trash2 } from 'lucide-react';

interface DomainCheckResult {
  domain: string;
  isAvailable: boolean;
  error?: string;
}

export default function DomainDebugPage() {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const router = useRouter();
  
  const [domainToCheck, setDomainToCheck] = useState('');
  const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckDomain = async () => {
    if (!domainToCheck.trim()) {
      showError('Please enter a domain to check');
      return;
    }

    const cleanDomain = domainToCheck.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    setIsChecking(true);
    setCheckResult(null);
    
    try {
      console.log('🔍 Starting domain availability check for:', cleanDomain);
      const isAvailable = await checkCustomDomainAvailability(cleanDomain);
      
      setCheckResult({
        domain: cleanDomain,
        isAvailable,
      });
      
      if (isAvailable) {
        showSuccess(`Domain "${cleanDomain}" is available!`);
      } else {
        showInfo(`Domain "${cleanDomain}" is already in use by another store.`);
      }
    } catch (error) {
      console.error('Error checking domain availability:', error);
      setCheckResult({
        domain: cleanDomain,
        isAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      showError('Failed to check domain availability');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AdminRoute>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard/system-management')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
              <Database className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Domain Debug Tool</h1>
              <p className="text-gray-600 mt-1">Check custom domain availability and troubleshoot conflicts</p>
            </div>
          </div>
        </div>

        {/* Domain Check Section */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Search className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Check Domain Availability</h2>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="domainInput" className="block text-sm font-medium text-gray-700 mb-2">
                    Domain to Check
                  </label>
                  <input
                    type="text"
                    id="domainInput"
                    value={domainToCheck}
                    onChange={(e) => setDomainToCheck(e.target.value)}
                    placeholder="example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleCheckDomain()}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the domain without "www" or "https://" (e.g., example.com)
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCheckDomain}
                    disabled={isChecking}
                    className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isChecking ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Check Domain
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Check Result */}
              {checkResult && (
                <div className={`p-4 rounded-lg border ${
                  checkResult.error 
                    ? 'bg-red-50 border-red-200' 
                    : checkResult.isAvailable 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {checkResult.error ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : checkResult.isAvailable ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        checkResult.error 
                          ? 'text-red-900' 
                          : checkResult.isAvailable 
                            ? 'text-green-900' 
                            : 'text-yellow-900'
                      }`}>
                        Domain: {checkResult.domain}
                      </h4>
                      <p className={`text-sm ${
                        checkResult.error 
                          ? 'text-red-800' 
                          : checkResult.isAvailable 
                            ? 'text-green-800' 
                            : 'text-yellow-800'
                      }`}>
                        {checkResult.error 
                          ? `Error: ${checkResult.error}`
                          : checkResult.isAvailable 
                            ? 'This domain is available and can be used.'
                            : 'This domain is already in use by another store.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start space-x-3">
              <Database className="w-6 h-6 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-3">How to Resolve Domain Conflicts</h3>
                <div className="text-sm text-blue-800 space-y-3">
                  <div>
                    <p className="font-medium mb-1">If a domain shows as "already in use":</p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Go to your Firebase Console → Firestore Database</li>
                      <li>Click on "Collection group" tab</li>
                      <li>Enter "stores" as the collection group name</li>
                      <li>Add filter: Field = "customDomain", Operator = "==", Value = "[your-domain]"</li>
                      <li>Review the results to see which store document is using the domain</li>
                      <li>Either delete the entire document or remove the "customDomain" field from it</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-100 rounded p-3">
                    <p className="font-medium text-blue-900 mb-1">⚠️ Important Notes:</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Even inactive or test stores can block domain availability</li>
                      <li>• Domains are checked across ALL stores in the database</li>
                      <li>• Make sure to check both verified and unverified domain entries</li>
                      <li>• After cleaning up, the domain should become available immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/data`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Database className="w-6 h-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Open Firestore Console</p>
                  <p className="text-sm text-gray-500">Access your Firebase database directly</p>
                </div>
              </a>
              
              <button
                onClick={() => router.push('/dashboard/system-management/users')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Globe className="w-6 h-6 text-secondary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-500">View and manage all user accounts</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}