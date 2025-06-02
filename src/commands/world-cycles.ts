import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

const WORLD_ICON = {
  cetus: 'https://wiki.warframe.com/images/thumb/Cetus.png/300px-Cetus.png',
  vallis: 'https://wiki.warframe.com/images/thumb/Orb_Vallis.png/300px-Orb_Vallis.png',
  cambion: 'https://wiki.warframe.com/images/thumb/CambionDrift.jpg/300px-CambionDrift.jpg',
};

/**
 * Format time difference as hh mm ss
 */
const getEndsIn = (expiry: string): string => {
  const ms = new Date(expiry).getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

/**
 * Shared embed builder
 */
const embed = (title: string, timeLabel: string, endsIn: string, icon: string): EmbedBuilder =>
  new EmbedBuilder()
    .setColor(DISCORD_COLOR.blue)
    .setTitle(title)
    .setDescription('World Cycle')
    .addFields(
      { name: 'Time', value: timeLabel, inline: true },
      { name: 'Ends In', value: endsIn, inline: true }
    )
    .setThumbnail(icon);

/**
 * Individual cycle embeds
 */
export const buildCetusWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cetusCycle?lang=en`);
  const data = await res.json();
  const time = data.isDay ? 'Day' : 'Night';
  return embed('Cetus/Earth', time, getEndsIn(data.expiry), WORLD_ICON.cetus);
};

export const buildCambionDriftWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/cambionCycle?lang=en`);
  const data = await res.json();
  const time = data.active.charAt(0).toUpperCase() + data.active.slice(1);
  return embed('Cambion Drift', time, getEndsIn(data.expiry), WORLD_ICON.cambion);
};

export const buildOrbVallisWorldCycleEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/vallisCycle?lang=en`);
  const data = await res.json();
  const time = data.state.charAt(0).toUpperCase() + data.state.slice(1);
  return embed('Orb Vallis', time, getEndsIn(data.expiry), WORLD_ICON.vallis);
};

/**
 * Combined embed with optional filtering
 */
export const buildWorldCyclesEmbed = async (filter?: string): Promise<EmbedBuilder | EmbedBuilder[]> => {
  const [cetusRes, cambionRes, vallisRes] = await Promise.all([
    fetch(`${WARFRAME_API}/cetusCycle?lang=en`).then(res => res.json()),
    fetch(`${WARFRAME_API}/cambionCycle?lang=en`).then(res => res.json()),
    fetch(`${WARFRAME_API}/vallisCycle?lang=en`).then(res => res.json())
  ]);

  const cetusTime = cetusRes.isDay ? 'Day' : 'Night';
  const cambionTime = cambionRes.active.charAt(0).toUpperCase() + cambionRes.active.slice(1);
  const vallisTime = vallisRes.state.charAt(0).toUpperCase() + vallisRes.state.slice(1);

  const cetusEnds = getEndsIn(cetusRes.expiry);
  const cambionEnds = getEndsIn(cambionRes.expiry);
  const vallisEnds = getEndsIn(vallisRes.expiry);

  const lcFilter = filter?.toLowerCase();
  if (lcFilter === 'cetus') return embed('Cetus/Earth', cetusTime, cetusEnds, WORLD_ICON.cetus);
  if (lcFilter === 'cambion') return embed('Cambion Drift', cambionTime, cambionEnds, WORLD_ICON.cambion);
  if (lcFilter === 'vallis' || lcFilter === 'orb vallis') return embed('Orb Vallis', vallisTime, vallisEnds, WORLD_ICON.vallis);

  return new EmbedBuilder()
    .setColor(DISCORD_COLOR.blue)
    .setTitle('World Cycles')
    .setDescription('Current day/night and weather cycles across open worlds')
    .addFields(
      { name: 'Cetus (Earth)', value: `${cetusTime}\nEnds: ${cetusEnds}`, inline: true },
      { name: 'Cambion Drift (Deimos)', value: `${cambionTime}\nEnds: ${cambionEnds}`, inline: true },
      { name: 'Orb Vallis (Venus)', value: `${vallisTime}\nEnds: ${vallisEnds}`, inline: true }
    )
    .setThumbnail(WORLD_ICON.cetus)
    .setFooter({ text: 'Cycle times are UTC-based and approximate to live state.' });
};
