/**
 * src/membership/MemberPortal.js
 * Handles member-specific logic, including booking window calculations.
 */
import { CONFIG } from '../../config.js';

export const MemberPortal = {
    /**
     * Calculates the allowed booking dates for a member based on their tier.
     * @param {string} tier - The member's tier ('FREE' or 'PRO').
     * @returns {string[]} An array of formatted date strings (e.g., 'Mon, Mar 10').
     */
    getBookingWindow(tier) {
        // Unified VIP Model: Everyone gets the full booking window
        let windowDays = CONFIG.membership.advanceBookingDaysFree;



        // --- 6 PM Rule (New York Time) ---
        // Get the current hour specifically in America/New_York timezone
        const nyTimeStr = new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour12: false
        });

        // Extract hour (Format is usually "MM/DD/YYYY, HH:MM:SS")
        const nyHour = parseInt(nyTimeStr.split(',')[1].split(':')[0].trim());

        // If it's 6:00 PM (18:00) or later, add an extra day to the window
        if (nyHour >= 18) {
            windowDays += 1;
        }

        const dates = [];
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: "America/New_York"
        });

        // Generate the date array
        for (let i = 0; i < windowDays; i++) {
            const date = new Date();
            // We use the local date but adjust it based on the index
            // The formatter will handle the timezone consistency
            date.setDate(date.getDate() + i);
            dates.push(formatter.format(date));
        }

        return dates;
    },

    /**
     * Checks if a member is eligible to make another reservation this month.
     * (Rule: Free Tier - Only 1 Reservation per month)
     * @param {Object} profile - The member profile from Firestore.
     * @returns {Object} { eligible: boolean, message: string }
     */
    checkEligibility(profile) {
        // Unified VIP Model: Everyone is eligible for unlimited reservations
        return { eligible: true, message: "Reservations available." };
    }


};
