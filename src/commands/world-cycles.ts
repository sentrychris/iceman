import { EmbedBuilder } from 'discord.js';
import { WARFRAME_API } from '../config';

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
  thumbnailUrl: string
) => {
  return new EmbedBuilder()
    .setColor(0x3498DB)
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
export const buildCetusWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
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
export const buildCambionDriftWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cambionCycle`);
  const data = await res.json();
  const time = data.active; // "fass" or "vome"
  return embed('Cambion Drift', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, THUMBNAILS.cambion);
};

/**
 * Orb Vallis/Venus world cycle
 * @returns 
 */
export const buildOrbVallisWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/vallisCycle`);
  const data = await res.json();
  const time = data.state; // "warm" or "cold"
  return embed('Orb Vallis', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, THUMBNAILS.vallis);
};
