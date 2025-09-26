let adminApp: any = null;

export async function getFirebaseAdminApp() {
  // Only run on server side
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK can only be used on the server side');
  }

  if (adminApp) {
    return adminApp;
  }

  try {
    const admin = require('firebase-admin');
    
    // Check if a Firebase app has already been initialized
    if (!admin.apps.length) {
      // Validate required environment variables
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing required Firebase Admin SDK environment variables. Please check NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your environment.');
      }

      // Clean the private key properly
      let cleanPrivateKey = privateKey;
      
      // Handle escaped newlines
      if (privateKey.includes('\\n')) {
        cleanPrivateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      // Ensure proper PEM format
      if (!cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Invalid private key format. Missing BEGIN PRIVATE KEY marker.');
      }
      
      if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Invalid private key format. Missing END PRIVATE KEY marker.');
      }
      
      // Extract only the PEM block
      const beginMarker = '-----BEGIN PRIVATE KEY-----';
      const endMarker = '-----END PRIVATE KEY-----';
      const beginIndex = cleanPrivateKey.indexOf(beginMarker);
      const endIndex = cleanPrivateKey.indexOf(endMarker);
      
      if (beginIndex === -1 || endIndex === -1) {
        throw new Error('Invalid private key format. Could not find PEM markers.');
      }
      
      // Extract the complete PEM block
      const pemBlock = cleanPrivateKey.substring(beginIndex, endIndex + endMarker.length);
      
      console.log('DEBUG: Firebase Admin PEM Block (first 50 chars):', pemBlock.substring(0, 50)); // Log only a portion for security
      console.log('DEBUG: Firebase Admin PEM Block (last 50 chars):', pemBlock.substring(pemBlock.length - 50)); // Log only a portion for security
      console.log('DEBUG: PEM Block length:', pemBlock.length);
      console.log('DEBUG: Project ID:', projectId);
      console.log('DEBUG: Client Email:', clientEmail);
      
      // Initialize with proper credential object
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: pemBlock,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      adminApp = admin.apps[0];
      console.log('✅ Using existing Firebase Admin app instance');
    }

    return admin;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('private key')) {
      console.error('🔑 Private key error - check that FIREBASE_ADMIN_PRIVATE_KEY is properly formatted');
    }
    
    throw new Error(`Firebase Admin initialization failed: ${error.message}`);
  }
}
