import { type Client, type TextChannel, EmbedBuilder } from 'discord.js';
import { INTERVAL_MS, WARFRAME_API, WORLD_CYCLE_TRACKING_CHANNEL } from '../config';

const THUMBNAILS = {
  cetus: 'https://wiki.warframe.com/images/thumb/Cetus.png/300px-Cetus.png',
  vallis: 'https://wiki.warframe.com/images/thumb/Orb_Vallis.png/300px-Orb_Vallis.png',
  cambion: 'https://wiki.warframe.com/images/thumb/CambionDrift.jpg/300px-CambionDrift.jpg',
};

/**
 * Build the embed message
 * 
 * @param worldName
 * @param dayOrNight 
 * @param endsIn 
 * @param embedColor
 * @returns 
 */
const embed = (
  worldName: string,
  dayOrNight: string,
  endsIn: string,
  thumbnailUrl: string,
  embedColor: number = 0x3498DB
) => {
  return new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(worldName)
    .setDescription('World Cycle')
    .addFields(
      { name: 'Time', value: dayOrNight, inline: true},
      { name: 'Ends In', value: endsIn, inline: true}
    )
    .setThumbnail(thumbnailUrl);
}

/**
 * Cetus/Earth world cycle
 * 
 * @returns 
 */
export const cetus = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cetusCycle`);
  const data = await res.json();
  const time = data.isDay ? 'Day' : 'Night';
  return embed('Cetus/Earth', time, data.timeLeft, THUMBNAILS.cetus);
};

/**
 * Cambion Drift/Deimos world cycle
 * 
 * @returns 
 */
export const cambionDrift = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cambionCycle`);
  const data = await res.json();
  const time = data.active; // "fass" or "vome"
  return embed('Cambion Drift', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, THUMBNAILS.cambion);
};

/**
 * Orb Vallis/Venus world cycle
 * @returns 
 */
export const orbVallis = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/vallisCycle`);
  const data = await res.json();
  const time = data.state; // "warm" or "cold"
  return embed('Orb Vallis', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, THUMBNAILS.vallis);
};

/**
 * Loop world cycles every hour
 * @param client
 */
export const startWorldCycleTrackingLoop = (client: Client): void => {
  client.once('ready', async () => {
    console.log('World cycle loop started');

    const channel = await client.channels.fetch(WORLD_CYCLE_TRACKING_CHANNEL);

    if (!channel || !channel.isTextBased()) {
      console.error('Invalid or non-text channel');
      return;
    }

    const sendEmbeds = async () => {
      try {
        const [cetusEmbed, cambionEmbed, vallisEmbed] = await Promise.all([
          cetus(),
          cambionDrift(),
          orbVallis(),
        ]);

        await (channel as TextChannel).send({
          embeds: [cetusEmbed, cambionEmbed, vallisEmbed],
        });

      } catch (err) {
        console.error('Failed to send world cycle embeds:', err);
      }
    };

    // Initial send immediately on startup
    await sendEmbeds();

    // Repeat every hour
    setInterval(sendEmbeds, INTERVAL_MS);
  });
}
