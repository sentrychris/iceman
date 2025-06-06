import fs from 'fs/promises';

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

export const loadStoredMessage = async (storageFilepath: string): Promise<{ channelId: string, messageId: string } | null> => {
  try {
    const data = await fs.readFile(storageFilepath, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveMessageReference = async (storageFilepath: string, channelId: string, messageId: string): Promise<void> => {
  const data = { channelId, messageId };
  await fs.writeFile(storageFilepath, JSON.stringify(data, null, 2), 'utf8');
};