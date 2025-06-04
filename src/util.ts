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