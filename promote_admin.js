import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATn_LRrT14QeRp7primG0dK82pcj7I_K0",
    authDomain: "vip-reservations.firebaseapp.com",
    projectId: "vip-reservations",
    storageBucket: "vip-reservations.firebasestorage.app",
    messagingSenderId: "721372947742",
    appId: "1:721372947742:web:441d5efe90198dbef2550f",
    measurementId: "G-QRL60MJTZ2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function promoteAdmin(uid) {
    const memberRef = doc(db, "members", uid);
    try {
        await updateDoc(memberRef, {
            tier: "ADMIN"
        });
        console.log(`✓ Successfully promoted ${uid} to ADMIN tier.`);
    } catch (error) {
        console.error("Error promoting member:", error);
    }
    process.exit(0);
}

// UID for jamesgirardi@live.com
promoteAdmin("P5bVOl8FZoWzsrAIViERjq42yo83");
