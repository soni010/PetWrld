import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Cloud Firestore with the configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider for 1-click Sign-In
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Boot connection verification as required by Firebase specification
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Cloud Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('[Firebase] Please check your Firebase configuration or network status.');
      return false;
    }
    // Any permission error or doc-not-found means the connection reached the server
    return true;
  }
}

// Test connection on module evaluation
testConnection();
