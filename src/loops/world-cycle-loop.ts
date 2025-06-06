import type { TextChannel, Message } from 'discord.js';
import { buildWorldCyclesEmbed } from '../commands/world-cycles';
import { getFormattedTimestamp } from '../util';
import fs from 'fs/promises';
import path from 'path';

const TRACKING_FILE_STORAGE_PATH = path.join(__dirname, '../../storage/tracking/world-cycles-message.json');

let postedMessage: Message | null = null;

export const setupWorldCycleLoop = async (channel: TextChannel) => {
  try {
    const stored = await loadStoredMessage();

    if (stored && stored.channelId === channel.id) {
      try {
        const existing = await channel.messages.fetch(stored.messageId);
        if (existing) {
          postedMessage = existing;
          console.log('Reusing previously posted world cycle message.');
        }
      } catch {
        console.log('Stored message not found; sending a new one.');
      }
    }

    if (!postedMessage) {
      const embed = await buildWorldCyclesEmbed({
        footer: `Message updates every 1 minute. Last updated: ${getFormattedTimestamp()} UTC`
      });
      postedMessage = await channel.send({
        embeds: Array.isArray(embed) ? embed : [embed],
      });
      await saveMessageReference(channel.id, postedMessage.id);
    }

    updateLoop();
  } catch (err) {
    console.error('Error setting up world cycle updater:', err);
  }
};

const updateLoop = async () => {
  if (!postedMessage) return;

  try {
    const newEmbed = await buildWorldCyclesEmbed({
      footer: `Message updates every 1 minute. Last updated: ${getFormattedTimestamp()} UTC`
    });
    await postedMessage.edit({
      embeds: Array.isArray(newEmbed) ? newEmbed : [newEmbed],
    });
  } catch (err) {
    console.error('Failed to update world cycle message:', err);
  }

  setTimeout(updateLoop, 1 * 60 * 1000);
};

const loadStoredMessage = async (): Promise<{ channelId: string, messageId: string } | null> => {
  try {
    const data = await fs.readFile(TRACKING_FILE_STORAGE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const saveMessageReference = async (channelId: string, messageId: string): Promise<void> => {
  const data = { channelId, messageId };
  await fs.writeFile(TRACKING_FILE_STORAGE_PATH, JSON.stringify(data, null, 2), 'utf8');
};
