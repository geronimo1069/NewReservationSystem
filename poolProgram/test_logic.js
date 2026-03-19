const nightCap = 30.00;
const dayCap = 25.00;
const MIGRATION_HOUR = 18;
const hourlyRate = 9.00;
const gracePeriodMins = 5;
const minimumCharge = 5.00;

function calculateDue(player) {
    let amount = 0;
    const now = new Date("2026-03-19T09:20:00"); // 9:20 AM
    const diffMs = now - player.startTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = diffMs / (1000 * 60 * 60);

    const testThreshold = MIGRATION_HOUR;
    const currentHour = now.getHours();
    const isNightPeriod = (currentHour >= testThreshold || currentHour < 5);
    const activeCap = isNightPeriod ? nightCap : dayCap;

    if (player.rateType === 'all_day' || player.rateType === 'night_special') {
        amount = activeCap;
    }
    return amount;
}

const player = { startTime: new Date("2026-03-19T09:00:00"), rateType: "all_day" };
console.log("Charge for all_day at 9:20 AM:", calculateDue(player));
