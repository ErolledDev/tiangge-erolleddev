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

      console.log('🔧 Firebase Admin Debug - Environment Variables Check:');
      console.log('- Project ID present:', !!projectId);
      console.log('- Client Email present:', !!clientEmail);
      console.log('- Private Key present:', !!privateKey);
      console.log('- Private Key length:', privateKey?.length || 0);
      console.log('- Private Key starts with BEGIN:', privateKey?.includes('-----BEGIN PRIVATE KEY-----') || false);
      console.log('- Private Key ends with END:', privateKey?.includes('-----END PRIVATE KEY-----') || false);
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing required Firebase Admin SDK environment variables. Please check NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your environment.');
      }

      // Clean and validate the private key
      console.log('🔧 Firebase Admin Debug - Before cleaning private key:');
      console.log('- Raw private key (first 100 chars):', privateKey.substring(0, 100));
      console.log('- Raw private key (last 100 chars):', privateKey.substring(privateKey.length - 100));
      console.log('- Contains \\n sequences:', privateKey.includes('\\n'));
      
      const cleanPrivateKey = privateKey.replace(/\\n/g, '\n');
      
      console.log('🔧 Firebase Admin Debug - After cleaning private key:');
      console.log('- Clean private key (first 100 chars):', cleanPrivateKey.substring(0, 100));
      console.log('- Clean private key (last 100 chars):', cleanPrivateKey.substring(cleanPrivateKey.length - 100));
      console.log('- Contains actual newlines:', cleanPrivateKey.includes('\n'));
      
      // Find the end marker and truncate any content after it
      const endMarker = '-----END PRIVATE KEY-----';
      const endIndex = cleanPrivateKey.indexOf(endMarker);
      
      console.log('🔧 Firebase Admin Debug - End marker search:');
      console.log('- End marker found at index:', endIndex);
      console.log('- End marker exists:', endIndex !== -1);
      
      if (endIndex === -1) {
        throw new Error('Invalid private key format. Missing END PRIVATE KEY marker.');
      }
      
      // Extract only the PEM block and ensure it ends with exactly one newline
      const pemBlock = cleanPrivateKey.substring(0, endIndex + endMarker.length).trim() + '\n';
      
      console.log('🔧 Firebase Admin Debug - Final PEM block:');
      console.log('- PEM block length:', pemBlock.length);
      console.log('- PEM block (first 100 chars):', pemBlock.substring(0, 100));
      console.log('- PEM block (last 100 chars):', pemBlock.substring(pemBlock.length - 100));
      console.log('- Starts with BEGIN marker:', pemBlock.includes('-----BEGIN PRIVATE KEY-----'));
      console.log('- Ends with END marker:', pemBlock.includes('-----END PRIVATE KEY-----'));
      console.log('- Number of lines:', pemBlock.split('\n').length);
      
      // Validate private key format
      if (!pemBlock.includes('-----BEGIN PRIVATE KEY-----') || !pemBlock.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Invalid private key format. Please ensure the private key includes the BEGIN and END markers.');
      }

      console.log('🔧 Firebase Admin Debug - Attempting to initialize Firebase Admin...');
      console.log('- Project ID:', projectId);
      console.log('- Client Email:', clientEmail);
      console.log('- PEM block ready for credential creation');
      
      // Initialize with proper credential object
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: pemBlock,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      
      console.log('✅ Firebase Admin Debug - Initialization successful!');
    } else {
      adminApp = admin.apps[0];
      console.log('✅ Firebase Admin Debug - Using existing app instance');
    }

    return admin;
  } catch (error) {
    console.error('❌ Firebase Admin Debug - Initialization failed:');
    console.error('- Error name:', error.name);
    console.error('- Error message:', error.message);
    console.error('- Error code:', error.code);
    console.error('- Full error object:', error);
    
    // Additional debugging for private key specific errors
    if (error.message && error.message.includes('private key')) {
      console.error('🔑 Private Key Debug - Additional info:');
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
      if (privateKey) {
        console.error('- Private key type:', typeof privateKey);
        console.error('- Private key is string:', typeof privateKey === 'string');
        console.error('- Private key has content:', privateKey.length > 0);
        console.error('- Private key sample (safe chars only):', privateKey.replace(/[^-\s\n]/g, '*').substring(0, 200));
      }
    }
    
    console.error('Firebase admin initialization error:', error);
    throw error;
  }
}
