export const getFormattedTimestamp = (): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(now.getUTCDate());
  const month = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = pad(now.getUTCHours());
  const minutes = pad(now.getUTCMinutes());
  const seconds = pad(now.getUTCSeconds());
  return `${day} ${month} at ${hours}:${minutes}:${seconds}`;
};

export const setDelayTime = () => {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 5, 0, 0)); // 00:05 UTC Monday

  // Advance to next Monday if we're past the update time or today isn't Monday
  const day = now.getUTCDay();
  if (day !== 1 || now >= next) {
    const daysUntilMonday = (8 - day) % 7;
    next.setUTCDate(next.getUTCDate() + daysUntilMonday);
  }

  const delay = next.getTime() - now.getTime();
  console.log(`Next Archon Hunt update scheduled in ${(delay / 1000 / 60).toFixed(1)} minutes.`);

  return delay;
}