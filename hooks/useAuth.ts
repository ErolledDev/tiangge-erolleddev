import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserProfile, UserProfile, updateUserRoleAndPremiumStatus, hasTrialExpired } from '@/lib/auth';
import { updateStore } from '@/lib/store';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const initAuth = async () => {
      try {
        if (!auth) {
          setLoading(false);
          return;
        }

        const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          
          if (user) {
            // Set up real-time listener for user profile changes
            const userDocRef = doc(db, 'users', user.uid);
            const profileUnsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const profile: UserProfile = {
                  uid: user.uid,
                  email: user.email || data.email || '',
                  ...data,
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                  updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                  trialEndDate: data.trialEndDate?.toDate ? data.trialEndDate.toDate() : data.trialEndDate
                };
                
                // Check if trial has expired and needs to be enforced
                if (hasTrialExpired(profile) && profile.isPremium === true && !profile.isPremiumAdminSet) {
                  try {
                    // Update user profile to remove premium status
                    await updateUserRoleAndPremiumStatus(user.uid, { 
                      isPremium: false 
                    });
                    
                    // Update store settings to disable premium features
                    await updateStore(user.uid, {
                      widgetEnabled: false,
                      bannerEnabled: false,
                      showCategories: false
                    });
                    
                    // The onSnapshot will automatically update with the new data
                  } catch (error) {
                    console.error('Error enforcing trial expiration:', error);
                    // Still set the profile even if update fails
                    setUserProfile(profile);
                  }
                } else {
                  setUserProfile(profile);
                }
              } else {
                setUserProfile(null);
              }
            }, (error) => {
              console.error('Error listening to user profile changes:', error);
              setUserProfile(null);
            });
            
            // Store the profile unsubscribe function for cleanup
            return profileUnsubscribe;
          } else {
            setUserProfile(null);
            return undefined;
          }
          
          setLoading(false);
        });

        return authUnsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    let authUnsubscribe: (() => void) | undefined;
    let profileUnsubscribe: (() => void) | undefined;
    
    initAuth().then((unsub) => {
      authUnsubscribe = unsub;
    });

    return () => {
      if (authUnsubscribe) {
        authUnsubscribe();
      }
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [mounted]);

  return { user, userProfile, loading: loading || !mounted };
};