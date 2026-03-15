/**
 * src/admin/ResManager.js
 * Admin tools for managing reservations.
 * Firestore-First architecture: Source of truth is the 'reservations' collection.
 */
import { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { getActiveConfig } from '../../config.js';

const activeEnv = getActiveConfig();
const db = getFirestore();

export const ResManager = {
    /**
     * Fetches reservations from Firestore collections 'reservations'.
     */
    async getAllReservations(filterPast = true) {
        try {
            const resRef = collection(db, "reservations");
            const q = query(resRef, orderBy("reservationTime", filterPast ? "asc" : "desc"));
            const querySnapshot = await getDocs(q);
            
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const results = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const resTime = new Date(data.reservationTime);
                
                // Filter logic
                if (filterPast) {
                    if (resTime >= today) {
                        results.push({ id: doc.id, ...data });
                    }
                } else {
                    if (resTime < today) {
                        results.push({ id: doc.id, ...data });
                    }
                }
            });

            return results;
        } catch (error) {
            console.error("ResManager Error:", error);
            return [];
        }
    },

    /**
     * Updates the status of a reservation in Firestore.
     */
    async updateStatus(resId, newStatus) {
        try {
            const resRef = doc(db, "reservations", resId);
            await updateDoc(resRef, {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Status Update Failed:", error);
            return false;
        }
    },

    /**
     * Updates reservation details in Firestore.
     */
    async updateDetails(resId, newDate, newTime) {
        try {
            // Combine newDate and newTime into ISO string
            // Expects newDate as YYYY-MM-DD and newTime as HH:mm
            const isoString = new Date(`${newDate}T${newTime}`).toISOString();
            
            const resRef = doc(db, "reservations", resId);
            await updateDoc(resRef, {
                reservationTime: isoString,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Details Update Failed:", error);
            return false;
        }
    },

    /**
     * Deletes a reservation from Firestore.
     */
    async deleteReservation(resId) {
        try {
            await deleteDoc(doc(db, "reservations", resId));
            return true;
        } catch (error) {
            console.error("Reservation Delete Error:", error);
            return false;
        }
    },

    /**
     * Listens to the reservations collection for real-time updates.
     */
    listenToReservations(callback, filterPast = true) {
        const resRef = collection(db, "reservations");
        const q = query(resRef, orderBy("reservationTime", filterPast ? "asc" : "desc"));
        
        return onSnapshot(q, (snapshot) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const results = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const resTime = new Date(data.reservationTime);
                
                if (filterPast) {
                    if (resTime >= today) {
                        results.push({ id: doc.id, ...data });
                    }
                } else {
                    if (resTime < today) {
                        results.push({ id: doc.id, ...data });
                    }
                }
            });
            callback(results);
        });
    }
};

