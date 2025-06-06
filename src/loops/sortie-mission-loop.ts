import type { Client, TextChannel, Message } from 'discord.js';
import { WARFRAME_LIVE_INFO_CHANNEL_ID } from '../config';
import { buildSortieEmbed } from '../commands/sortie-mission';
import { getFormattedTimestamp } from '../util';
import fs from 'fs/promises';
import path from 'path';

const TRACKING_FILE_STORAGE_PATH = path.join(__dirname, '../../storage/tracking/sortie-mission-message.json');

let postedMessage: Message | null = null;

export const setupSortieMissionLoop = async (client: Client) => {
  try {
    const channel = await client.channels.fetch(WARFRAME_LIVE_INFO_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error('Sortie channel is invalid or not text-based.');
      return;
    }

    const textChannel = channel as TextChannel;
    const stored = await loadStoredMessage();

    if (stored && stored.channelId === textChannel.id) {
      try {
        const existing = await textChannel.messages.fetch(stored.messageId);
        if (existing) {
          postedMessage = existing;
          console.log('Reusing previously posted sortie message.');
        }
      } catch {
        console.log('Stored sortie message not found; sending a new one.');
      }
    }

    if (!postedMessage) {
      postedMessage = await textChannel.send({
        embeds: [await buildSortieEmbed({
          footer: `Message updates every 5 minutes. Last updated: ${getFormattedTimestamp()} UTC`
        })],
      });
      await saveMessageReference(textChannel.id, postedMessage.id);
    }

    scheduleNextUpdate();
  } catch (err) {
    console.error('Error setting up sortie updater:', err);
  }
};

const scheduleNextUpdate = () => {
  setTimeout(updateSortieMessage, 5 * 60 * 1000);
};

const updateSortieMessage = async () => {
  if (!postedMessage) return;

  try {
    await postedMessage.edit({
      embeds: [await buildSortieEmbed({
        footer: `Message updates every 5 minutes. Last updated: ${getFormattedTimestamp()} UTC`
      })]
    });
  } catch (err) {
    console.error('Failed to update sortie message:', err);
  }

  scheduleNextUpdate();
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
