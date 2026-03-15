---
trigger: always_on
---

## SLATE Feature Roadmap & Loyalty Overhaul

**Phase 1: Revenue-Based Loyalty & Upfront Redemption (COMPLETED)**

- [x] Converted loyalty math from time-based to revenue-based ($1 Paid = 5 Points).
- [x] Updated `loyaltyHandshake` to calculate points accurately based on pre-paid and post-paid amounts.
- [x] Built the `[REDEEM 900 PTS]` toggle directly into the Active Table command center.
- [x] Added safety locks (requires 900 points AND a minimum $9 balance to trigger).
- [x] Cleaned up table panel UI to show Amount Pre-Paid vs. Amount Due cleanly above the action buttons.
- [ ] Annual Membership Tier (Pay upfront for 365 days, earn points at standard rate).

**Phase 2: The "On The Way" Flow (COMPLETED)**

- [x] "Same Day Arrival" / Walk-In Alert: Member app sends `isSameDay: true` flag. Employee HUD displays a glowing orange "ON THE WAY" badge instead of standard "PENDING".
- [ ] Automated Google Review Email: Triggered on session `COMPLETED` for first-time visits in 30 days.

**Phase 2.5: Firebase Event Migration (INTEGRATED)**

- [x] Migrated Event Management from Google Sheets to Firestore.
- [x] Built "Event Manager" with Dual-Mode (Active Assign vs. Schedule Future).
- [x] Implemented merged HUD listener for real-time Reservations + Events.
- [x] Added "Internal" vs "Public" note fields for staff/website separation.
- [ ] Integrate Firestore feed into `www.vipbilliardsinc.com` (Pending user import).

**Phase 3: Advanced Player Experience (UPCOMING)**

- [ ] Favorite Table Selection: Gray out occupied tables in the member app.
- [ ] Player Status Tags: Allow members to set "Practice Round" or "Challenge Round".

**Phase 4: Social Integrations (PAUSED)**

- [ ] App-generated stat graphics for members to manually share on Facebook/Instagram (bypassing Meta API limits).

## Combining join.html, join2.html and join3.html into one full Join Page

\*\* Firestore and Stripe test links

- [ ] Update join2.html with the code necessary for the Stripe "Success URL" like we did in join.html

** Taking the best from each page**

- [ ] Keeping join2.html as the page we will use for the future.
- [ ] All current and future styling will reference/use the join2.css file.
- [ ] From join.html, reuse the section, 'How VIP Points Work' and add that to the join2.html file, making sure to convert the CSS so it uses the CSS from join2.css
- [ ] From join.html, reuse the section, 'FAQ' and add that to the join2.html file, making sure to convert the CSS so it uses the CSS from the join.css file.

\*\* What to add/change to join2.html

- [X] VIP Billiards Logo in the Header
- [X] Change 'Main Site' to Go back to VIP's Home Page
- [X] Change 'System Update' to 'Reservations Upgrades'
- [X] Remove the period in 'The New VIP Billiards.'
- [X] Change 'Claim your table' to 'See The Plans'

## Adding a Favorite Table # to VIP Member's Profile

- [X] Add the field "My Preferred Table Today" and update the index.html file in the member folder. It's specific to VIP Billiards, so the options can only be between 1 and 17 or "leave blank for 'no preference'. Ensure that Firestore has the same update. The setting should be under My Account window.

- [X] When clicking on "I'm Heading There Now!" button, there should be the option to use the "preferred table, pick a new table, or no preference" and an option to pick an ETA or timeframe "I'm already here, I'll be there within the hour, I'm not sure what time but I am coming today, before the Confirm button.

- [X] In the pool_program.html file, there needs to be a new type of reservation in the Reservation HUD called Same Day Arrival. When a customer clicks on their I'm Heading There Now button, the reservation will now be called a Same Day Arrival and have a different color scheme than the Events and the Reservations. The Same Day Arrival will have the Members's name and the table preference and the ETA option.

## Launch Checklist

- [X] Updated the vipbilliardsinc.com's index.html file to include new verbage about the VIP Member Program.