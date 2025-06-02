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
const embed = (title: string, timeLabel: string, endsIn: string, icon: string, color: number): EmbedBuilder => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription('Current world cycle')
    .addFields(
      { name: 'Time', value: timeLabel, inline: true },
      { name: 'Ends In', value: endsIn, inline: true }
    )
    .setThumbnail(icon)
    .setFooter({ text: 'Cycle times are UTC-based and approximate to live state.' });
}

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
  if (lcFilter === 'cetus') return embed('Cetus/Earth', cetusTime, cetusEnds, WORLD_ICON.cetus, DISCORD_COLOR.orange);
  if (lcFilter === 'cambion') return embed('Cambion Drift', cambionTime, cambionEnds, WORLD_ICON.cambion, DISCORD_COLOR.red);
  if (lcFilter === 'vallis' || lcFilter === 'orb vallis') return embed('Orb Vallis', vallisTime, vallisEnds, WORLD_ICON.vallis, DISCORD_COLOR.blue);

  return new EmbedBuilder()
    .setColor(DISCORD_COLOR.purple)
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
