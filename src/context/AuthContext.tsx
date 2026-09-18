import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import {
  saveUserProfileToFirestore,
  subscribeUserProfile,
  subscribePetsFromFirestore,
  subscribeAppointmentsFromFirestore,
  savePetToFirestore,
} from '../firebase/firestoreService';
import { UserAccount, PetProfile, BookingAppointment } from '../types';
import { setCurrentUser, getCurrentUser } from '../data/initialAccounts';
import { INITIAL_PETS } from '../data/initialData';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: UserAccount | null;
  isLoading: boolean;
  isCloudConnected: boolean;
  signInWithGoogle: () => Promise<UserAccount | null>;
  logout: () => Promise<void>;
  updateAccount: (account: UserAccount) => void;
  syncAccountToFirestore: (account: UserAccount) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(() => getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Synchronize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsCloudConnected(true);
        // Build or hydrate user account from Google Sign-In
        const googleAccount: UserAccount = {
          id: user.uid,
          email: user.email || 'user@petwrld.com',
          owner: {
            id: `owner-${user.uid}`,
            name: user.displayName || user.email?.split('@')[0] || 'Pet Parent',
            phone: user.phoneNumber || '+91 98200 12345',
            gender: 'Prefer not to say',
            email: user.email || '',
            address: 'Metro Companion Residence',
            city: 'Bengaluru',
            pincode: '560001',
            emergencyContact: '+91 98200 99999',
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          },
          pets: [INITIAL_PETS[0]],
          activePetId: INITIAL_PETS[0].id,
        };

        // If local user was already loaded with same UID or email, merge
        const existing = getCurrentUser();
        const mergedAccount = existing && existing.id === user.uid ? existing : googleAccount;

        setCurrentUserState(mergedAccount);
        setCurrentUser(mergedAccount);

        // Sync to Cloud Firestore
        try {
          await saveUserProfileToFirestore(mergedAccount, 250);
          if (mergedAccount.pets.length > 0) {
            await savePetToFirestore(mergedAccount.id, mergedAccount.pets[0]);
          }
        } catch (e) {
          console.warn('[Firestore] Profile initial sync note:', e);
        }
      } else {
        setIsCloudConnected(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserAccount | null> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const newAccount: UserAccount = {
        id: user.uid,
        email: user.email || '',
        owner: {
          id: `owner-${user.uid}`,
          name: user.displayName || user.email?.split('@')[0] || 'Pet Parent',
          phone: user.phoneNumber || '+91 98200 12345',
          gender: 'Prefer not to say',
          email: user.email || '',
          address: 'Metro Companion Residence',
          city: 'Bengaluru',
          pincode: '560001',
          emergencyContact: '+91 98200 99999',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        },
        pets: [INITIAL_PETS[0]],
        activePetId: INITIAL_PETS[0].id,
      };

      setCurrentUserState(newAccount);
      setCurrentUser(newAccount);
      setIsCloudConnected(true);

      // Persist to Firestore
      await saveUserProfileToFirestore(newAccount, 250);
      await savePetToFirestore(newAccount.id, newAccount.pets[0]);

      return newAccount;
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUserState(null);
    setCurrentUser(null);
    setIsCloudConnected(false);
  };

  const updateAccount = (account: UserAccount) => {
    setCurrentUserState(account);
    setCurrentUser(account);
  };

  const syncAccountToFirestore = async (account: UserAccount) => {
    try {
      await saveUserProfileToFirestore(account);
      setIsCloudConnected(true);
    } catch (e) {
      console.error('Failed to sync account to Firestore:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        isLoading,
        isCloudConnected,
        signInWithGoogle,
        logout,
        updateAccount,
        syncAccountToFirestore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
