const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const DAYS_PER_WEEK = 7

/**
 * The last moment of the current week: Sunday 23:59:59.999 in local time.
 * On a Sunday it is the end of that same day.
 * @param {Date} now
 * @returns {Date}
 */
export function endOfWeek(now) {
  const end = new Date(now)
  // getDay() is 0 on Sunday, so Sunday itself is 0 days away.
  const daysUntilSunday = (DAYS_PER_WEEK - end.getDay()) % DAYS_PER_WEEK
  end.setDate(end.getDate() + daysUntilSunday)
  end.setHours(23, 59, 59, 999)
  return end
}

/**
 * Splits a duration into whole days, hours, minutes and seconds. Negative values count as 0.
 * @param {number} milliseconds
 * @returns {{ days: number, hours: number, minutes: number, seconds: number }}
 */
export function splitDuration(milliseconds) {
  const totalSeconds = Math.max(Math.floor(milliseconds / MS_PER_SECOND), 0)
  const totalMinutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE)
  const totalHours = Math.floor(totalMinutes / MINUTES_PER_HOUR)
  return {
    days: Math.floor(totalHours / HOURS_PER_DAY),
    hours: totalHours % HOURS_PER_DAY,
    minutes: totalMinutes % MINUTES_PER_HOUR,
    seconds: totalSeconds % SECONDS_PER_MINUTE,
  }
}
