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
        const isPro = tier?.toUpperCase() === 'PRO';
        let windowDays = CONFIG.membership.membershipMode === 'freeVIP'
            ? CONFIG.membership.advanceBookingDaysFree
            : CONFIG.membership.advanceBookingDaysFree;



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
        if (!profile) {
            return { eligible: false, message: "Profile not found." };
        }

        // If using the new freeVIP model → unlimited reservations for everyone
        if (CONFIG.membership.membershipMode === 'freeVIP') {
            return { eligible: true, message: "Reservations available." };
        }

        // --- Legacy Mode Logic ---
        const tier = profile.tier?.toUpperCase() || 'FREE';

        // Paid tiers always unlimited in legacy mode
        if (tier === 'PAID' || tier === 'PRO' || tier === 'ADMIN') {
            return { eligible: true, message: "Unlimited reservations for your tier!" };
        }

        // Free tier monthly limit (legacy only)
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;

        if (
            profile.lastReservationMonth === currentMonth &&
            profile.reservationCountThisMonth >= CONFIG.membership.freeTierLimit
        ) {
            return {
                eligible: false,
                message: "Free tier limit reached (1 reservation per month)."
            };
        }

        return { eligible: true, message: "Reservations available." };
    }


};
