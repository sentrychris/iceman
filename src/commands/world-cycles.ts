import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

const WORLD_ICON = {
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
    .setColor(DISCORD_COLOR.blue)
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
  const res = await fetch(`${WARFRAME_API}/cetusCycle?lang=en`);
  const data = await res.json();
  const time = data.isDay ? 'Day' : 'Night';
  return embed('Cetus/Earth', time, data.timeLeft, WORLD_ICON.cetus);
};

/**
 * Cambion Drift/Deimos world cycle
 * 
 * @returns 
 */
export const buildCambionDriftWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cambionCycle?lang=en`);
  const data = await res.json();
  const time = data.active; // "fass" or "vome"
  return embed('Cambion Drift', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, WORLD_ICON.cambion);
};

/**
 * Orb Vallis/Venus world cycle
 * @returns 
 */
export const buildOrbVallisWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/vallisCycle?lang=en`);
  const data = await res.json();
  const time = data.state; // "warm" or "cold"
  return embed('Orb Vallis', time.charAt(0).toUpperCase() + time.slice(1), data.timeLeft, WORLD_ICON.vallis);
};

/**
 * Build world cycles embed
 */
export const buildWorldCyclesEmbed = async(): Promise<EmbedBuilder[]> => {
  const [cetusEmbed, cambionEmbed, vallisEmbed] = await Promise.all([
    buildCetusWorldCycleEmbed(),
    buildCambionDriftWorldCycleEmbed(),
    buildOrbVallisWorldCycleEmbed(),
  ]);

  return [cetusEmbed, cambionEmbed, vallisEmbed];
}
