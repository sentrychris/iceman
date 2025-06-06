import type { TextChannel, Message } from 'discord.js';
import path from 'path';
import { buildWorldCyclesEmbed } from '../commands/world-cycles';
import { getFormattedTimestamp, loadStoredMessage, saveMessageReference } from '../util';

const TRACKING_FILE = path.join(__dirname, '../../storage/tracking/world-cycles-message.json');

let message: Message | null = null;

export const setupWorldCycleLoop = async (channel: TextChannel) => {
  try {
    const stored = await loadStoredMessage(TRACKING_FILE);

    if (stored && stored.channelId === channel.id) {
      try {
        const existing = await channel.messages.fetch(stored.messageId);
        if (existing) {
          message = existing;
          console.log('Reusing previously posted world cycle message.');
        }
      } catch {
        console.log('Stored message not found; sending a new one.');
      }
    }

    if (!message) {
      const embed = await buildWorldCyclesEmbed({
        footer: `Message updates every 1 minute. Last updated: ${getFormattedTimestamp()} UTC`
      });
      message = await channel.send({
        embeds: Array.isArray(embed) ? embed : [embed],
      });
      await saveMessageReference(TRACKING_FILE, channel.id, message.id);
    }

    updateLoop();
  } catch (err) {
    console.error('Error setting up world cycle updater:', err);
  }
};

const updateLoop = async () => {
  if (!message) return;

  try {
    const newEmbed = await buildWorldCyclesEmbed({
      footer: `Message updates every 1 minute. Last updated: ${getFormattedTimestamp()} UTC`
    });
    await message.edit({
      embeds: Array.isArray(newEmbed) ? newEmbed : [newEmbed],
    });
  } catch (err) {
    console.error('Failed to update world cycle message:', err);
  }

  setTimeout(updateLoop, 1 * 60 * 1000);
};
