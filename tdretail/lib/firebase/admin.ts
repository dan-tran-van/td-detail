import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let firebaseAppInstance: App | null = null;
let isConfigured = false;

export function initFirebaseAdmin(): {
  app: App | null;
  firestore: Firestore | null;
  auth: Auth | null;
  isConfigured: boolean;
} {
  if (firestoreInstance && firebaseAppInstance && authInstance) {
    return {
      app: firebaseAppInstance,
      firestore: firestoreInstance,
      auth: authInstance,
      isConfigured: true,
    };
  }

  // Check if credentials exist in environment
  const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    if (serviceAccountKeyJson) {
      const serviceAccount = JSON.parse(serviceAccountKeyJson);
      firebaseAppInstance = getApps().length === 0
        ? initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
        })
        : getApps()[0];
      firestoreInstance = getFirestore(firebaseAppInstance);
      try {
        firestoreInstance.settings({ ignoreUndefinedProperties: true });
      } catch (settingsErr) {
        // settings can only be set once
      }
      authInstance = getAuth(firebaseAppInstance);
      isConfigured = true;
      return {
        app: firebaseAppInstance,
        firestore: firestoreInstance,
        auth: authInstance,
        isConfigured: true,
      };
    } else if (projectId) {
      // In Google Cloud Run, Application Default Credentials (ADC) are automatically available via the compute service account.
      firebaseAppInstance = getApps().length === 0
        ? initializeApp({ projectId })
        : getApps()[0];
      firestoreInstance = getFirestore(firebaseAppInstance);
      try {
        firestoreInstance.settings({ ignoreUndefinedProperties: true });
      } catch (settingsErr) {
        // settings can only be set once
      }
      authInstance = getAuth(firebaseAppInstance);
      isConfigured = true;
      return {
        app: firebaseAppInstance,
        firestore: firestoreInstance,
        auth: authInstance,
        isConfigured: true,
      };
    }
  } catch (error) {
    console.warn('[FirebaseAdmin] Could not initialize Firebase Admin SDK with provided credentials, falling back to local persistent store:', error);
  }

  return { app: null, firestore: null, auth: null, isConfigured: false };
}

export function isFirebaseConfigured(): boolean {
  return isConfigured;
}
