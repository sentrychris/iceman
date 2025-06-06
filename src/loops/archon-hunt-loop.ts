import type { Client, TextChannel, Message } from 'discord.js';
import { WARFRAME_LIVE_INFO_CHANNEL_ID } from '../config';
import { buildArchonHuntEmbed } from '../commands/archon-hunt';
import { getFormattedTimestamp } from '../util';
import fs from 'fs/promises';
import path from 'path';

const TRACKING_FILE_STORAGE_PATH = path.join(__dirname, '../../storage/tracking/archon-hunt-message.json');

let postedMessage: Message | null = null;

export const setupArchonHuntLoop = async (client: Client) => {
  try {
    const channel = await client.channels.fetch(WARFRAME_LIVE_INFO_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error('Archon channel is invalid or not text-based.');
      return;
    }

    const textChannel = channel as TextChannel;
    const stored = await loadStoredMessage();

    if (stored && stored.channelId === textChannel.id) {
      try {
        const existing = await textChannel.messages.fetch(stored.messageId);
        if (existing) {
          postedMessage = existing;
          console.log('Reusing previously posted Archon Hunt message.');
        }
      } catch {
        console.log('Stored Archon message not found; sending a new one.');
      }
    }

    if (!postedMessage) {
      const embed = await buildArchonHuntEmbed({
        footer: `Message updates every 5 minutes. Last updated: ${getFormattedTimestamp()} UTC`
      });
      postedMessage = await textChannel.send({
        embeds: [embed],
      });
      await saveMessageReference(textChannel.id, postedMessage.id);
    }

    scheduleNextUpdate();
  } catch (err) {
    console.error('Error setting up Archon Hunt updater:', err);
  }
};

const scheduleNextUpdate = () => {
  setTimeout(updateArchonMessage, 5 * 60 * 1000);
};

const updateArchonMessage = async () => {
  if (!postedMessage) return;

  try {
    const embed = await buildArchonHuntEmbed({
      footer: `Message updates every 5 minutes. Last updated: ${getFormattedTimestamp()} UTC`
    });
    await postedMessage.edit({ embeds: [embed] });
    console.log('Archon Hunt message updated.');
  } catch (err) {
    console.error('Failed to update Archon Hunt message:', err);
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
