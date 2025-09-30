'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🏠 Home: Component mounting...');
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('🏠 Home: Navigation effect triggered', { 
      loading, 
      mounted, 
      userExists: !!user,
      userEmail: user?.email 
    });
    if (!loading && mounted) {
      if (user) {
        console.log('🏠 Home: User found, redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        console.log('🏠 Home: No user found, redirecting to auth...');
        router.push('/auth');
      }
    }
  }, [user, loading, router, mounted]);

  console.log('🏠 Home: Render state', { mounted, loading, userExists: !!user });

  if (!mounted || loading) {
    console.log('🏠 Home: Showing loading spinner...');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {console.log('🏠 Home: Rendering fallback spinner...')}
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
