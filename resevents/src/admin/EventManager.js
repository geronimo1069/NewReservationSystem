/**
 * src/admin/EventManager.js
 * Admin tools for managing events.
 * Firestore-First architecture: Source of truth is the 'events' collection.
 */
import { getFirestore, doc, collection, getDocs, query, where, orderBy, onSnapshot, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export const EventManager = {
    /**
     * Listens to the events collection for real-time updates.
     */
    listenToEvents(callback, filterPast = true) {
        const eventsRef = collection(db, "events");
        const today = new Date().toISOString().split('T')[0];
        
        let q;
        if (filterPast) {
            q = query(eventsRef, where("date", ">=", today), orderBy("date", "asc"));
        } else {
            q = query(eventsRef, where("date", "<", today), orderBy("date", "desc"));
        }
        
        return onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            callback(results);
        });
    },

    /**
     * Saves a new event or updates an existing one.
     */
    async saveEvent(eventData, eventId = null) {
        try {
            const cleanData = {
                title: eventData.title,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime || "",
                internalNotes: eventData.internalNotes || "",
                publicNotes: eventData.publicNotes || "",
                public: eventData.public !== undefined ? eventData.public : true,
                updatedAt: new Date().toISOString()
            };

            if (eventId) {
                const eventRef = doc(db, "events", eventId);
                await updateDoc(eventRef, cleanData);
                return { success: true, id: eventId };
            } else {
                cleanData.createdAt = new Date().toISOString();
                const docRef = await addDoc(collection(db, "events"), cleanData);
                return { success: true, id: docRef.id };
            }
        } catch (error) {
            console.error("EventManager Save Error:", error);
            return { success: false, error };
        }
    },

    /**
     * Deletes an event from Firestore.
     */
    async deleteEvent(eventId) {
        try {
            await deleteDoc(doc(db, "events", eventId));
            return true;
        } catch (error) {
            console.error("EventManager Delete Error:", error);
            return false;
        }
    }
};
