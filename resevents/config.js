/**
 * config.js
 * Centralized configuration for Firebase and Membership Rules.
 */

export const CONFIG = {
    firebase: {
        apiKey: "AIzaSyATn_LRrT14QeRp7primG0dK82pcj7I_K0",
        authDomain: "vip-reservations.firebaseapp.com",
        projectId: "vip-reservations",
        storageBucket: "vip-reservations.firebasestorage.app",
        messagingSenderId: "721372947742",
        appId: "1:721372947742:web:441d5efe90198dbef2550f"
    },
    adminEmail: "slatetimetracking@gmail.com",
    membership: {
        membershipMode: 'freeVIP', // 'freeVIP' = unlimited, 'legacy' = 1 per month limit
        advanceBookingDaysFree: 7,
        freeTierLimit: 1
    }
};

/**
 * Returns the configuration based on the environment.
 * Currently defaults to the production object.
 */
export function getActiveConfig() {
    return CONFIG;
}
