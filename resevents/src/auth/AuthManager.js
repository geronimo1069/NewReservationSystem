/**
 * src/auth/AuthManager.js
 * Handles User Registration, Login, and Tier Validation.
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { CONFIG, getActiveConfig } from '../../config.js';

const activeEnv = getActiveConfig();
const app = initializeApp(activeEnv.firebase);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const AuthManager = {
  /**
   * Signs a user in with Google and checks their membership status.
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // After login, check if they exist in our Firestore 'members' collection
      const memberProfile = await this.getOrCreateProfile(user);

      console.log(`Welcome back, ${memberProfile.name}! Tier: ${memberProfile.tier}`);
      return { user, profile: memberProfile };
    } catch (error) {
      console.error("Login Failed:", error.message);
      throw error;
    }
  },

  /**
   * Checks Firestore for a profile using Email as the Primary Key.
   * If none exists, creates a default 'FREE' tier.
   */
  async getOrCreateProfile(user) {
    // UPDATED: Using UID as the Primary Key for reliability
    const emailKey = user.email.toLowerCase();
    const userRef = doc(db, "members", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // New Member! Initialize based on gemini.md rules
      const newProfile = {
        email: emailKey,
        uid: user.uid, // Keep UID as a field for auth reference
        name: user.displayName,
        avatar: user.photoURL,
        tier: "PRO",
        joinedDate: new Date().toISOString(),

        /* Loyalty Program Data (Rule: Loyalty Program Info) */
        loyaltyPoints: 0,
        lifetimeHours: 0,

        /* Reservation Tracking (Rule: Free Tier - 1 per month) */
        lastReservationMonth: null, // Track month of last booking (e.g., "2026-03")
        reservationCountThisMonth: 0,

        /* Profile Fields (Rule: Digital Membership Card) */
        mobileCarrier: "", // Placeholder for Email-to-SMS Gateway
        phone: ""
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    }
  },

  async logout() {
    await signOut(auth);
    console.log("User signed out.");
  }
};