import { Client, TextChannel, Message } from 'discord.js';
import { WORLD_CYCLES_TRACKING_CHANNEL } from '../config';
import { buildWorldCyclesEmbed } from '../commands/world-cycles';
import fs from 'fs/promises';
import path from 'path';

const CYCLE_REFRESH_INTERVAL = 1 * 60 * 1000;
const CYCLE_STORAGE_PATH = path.join(__dirname, '../../storage/world-cycles.json');

let postedMessage: Message | null = null;

export const setupWorldCycleLoop = (client: Client) => {
  client.once('ready', async () => {
    try {
      const channel = await client.channels.fetch(WORLD_CYCLES_TRACKING_CHANNEL);
      if (!channel || !channel.isTextBased()) {
        console.error('Channel is invalid or not text-based.');
        return;
      }
      const textChannel = channel as TextChannel;

      const stored = await loadStoredMessage();

      if (stored && stored.channelId === textChannel.id) {
        try {
          const existing = await textChannel.messages.fetch(stored.messageId);
          if (existing) {
            postedMessage = existing;
            console.log('Reusing previously posted world cycle message.');
          }
        } catch {
          console.log('Stored message not found; sending a new one.');
        }
      }

      if (!postedMessage) {
        const embed = await buildWorldCyclesEmbed();
        postedMessage = await textChannel.send({
          embeds: Array.isArray(embed) ? embed : [embed],
        });
        await saveMessageReference(textChannel.id, postedMessage.id);
      }

      updateLoop();
    } catch (err) {
      console.error('Error setting up world cycle updater:', err);
    }
  });
};

const updateLoop = async () => {
  if (!postedMessage) return;

  try {
    const newEmbed = await buildWorldCyclesEmbed();
    await postedMessage.edit({
      embeds: Array.isArray(newEmbed) ? newEmbed : [newEmbed],
    });
  } catch (err) {
    console.error('Failed to update world cycle message:', err);
  }

  setTimeout(updateLoop, CYCLE_REFRESH_INTERVAL);
};

const loadStoredMessage = async (): Promise<{ channelId: string, messageId: string } | null> => {
  try {
    const data = await fs.readFile(CYCLE_STORAGE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const saveMessageReference = async (channelId: string, messageId: string): Promise<void> => {
  const data = { channelId, messageId };
  await fs.writeFile(CYCLE_STORAGE_PATH, JSON.stringify(data, null, 2), 'utf8');
};
