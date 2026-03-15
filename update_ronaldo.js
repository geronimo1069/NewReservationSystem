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

async function upgradeMember(uid) {
    const memberRef = doc(db, "members", uid);
    try {
        await updateDoc(memberRef, {
            tier: "PRO"
        });
        console.log(`✓ Successfully upgraded user ${uid} to PRO tier.`);
    } catch (error) {
        console.error("Error updating member:", error);
    }
    process.exit(0);
}

// UID for Ronaldo Jackson
upgradeMember("td9QOnngT8UqMGa3cjwT6ZVLGW82");
