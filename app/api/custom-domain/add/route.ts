import { NextRequest, NextResponse } from 'next/server';
import { addCustomDomain } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Custom domain add API called');
    
    const { domain } = await req.json();
    console.log('📝 Domain received:', domain);

    if (!domain) {
      return NextResponse.json({ success: false, message: 'Domain is required.' }, { status: 400 });
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ success: false, message: 'Invalid domain format. Please enter a valid domain (e.g., example.com).' }, { status: 400 });
    }

    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    console.log('🔐 ID Token present:', !!idToken);
    
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    try {
      console.log('🔧 Initializing Firebase Admin...');
      const { getFirebaseAdminApp } = await import('@/lib/firebase-admin');
      const admin = await getFirebaseAdminApp();
      console.log('✅ Firebase Admin initialized successfully');
      
      console.log('🔍 Verifying ID token...');
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      console.log('👤 User ID:', userId);

      // Check if user is premium
      console.log('💎 Checking user premium status...');
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userId).get();
      console.log('📄 User doc exists:', userDoc.exists);
      
      if (!userDoc.exists) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }
      
      const userData = userDoc.data();
      console.log('👤 User data:', { 
        uid: userId, 
        email: userData?.email, 
        isPremium: userData?.isPremium,
        role: userData?.role 
      });
      
      if (!userData?.isPremium && userData?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Premium subscription required for custom domains.' }, { status: 403 });
      }

      console.log('🌐 Adding custom domain...');
      const { verificationCode } = await addCustomDomain(userId, domain.toLowerCase());
      console.log('✅ Custom domain added successfully');

      return NextResponse.json({
        success: true,
        message: 'Custom domain added. Please add the TXT record to your DNS settings.',
        verificationCode,
        txtRecordName: `_bolt-verify.${domain.toLowerCase()}`
      });
    } catch (adminError) {
      console.error('🔥 Firebase Admin Error:', adminError);
      
      // Handle specific Firebase Admin errors
      if (adminError.message && adminError.message.includes('private key')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Server configuration error. Please contact support.' 
        }, { status: 500 });
      }
      
      if (adminError.message && adminError.message.includes('credential')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Authentication configuration error. Please contact support.' 
        }, { status: 500 });
      }
      
      throw adminError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('💥 API Error adding custom domain:', error);
    console.error('📊 Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Return a more user-friendly error message
    let errorMessage = 'Failed to add custom domain.';
    
    if (error.message && error.message.includes('Firebase')) {
      errorMessage = 'Server configuration issue. Please try again or contact support.';
    } else if (error.message && error.message.includes('already in use')) {
      errorMessage = error.message;
    } else if (error.message && error.message.includes('Premium')) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage 
    }, { status: 500 });
  }
}