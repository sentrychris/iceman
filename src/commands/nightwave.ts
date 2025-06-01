import { EmbedBuilder } from 'discord.js';
import { WARFRAME_API } from '../config';

const NIGHTWAVE_ICON = 'https://wiki.warframe.com/images/thumb/NightwaveSyndicate.png/300px-NightwaveSyndicate.png';

interface NightwaveChallenge {
  title: string;
  desc: string;
  reputation: number;
  isDaily: boolean;
  isElite: boolean;
  expiry: string;
  startString: string;
}

const formatLabel = (c: NightwaveChallenge): string => {
  if (c.isDaily) return '🟦 Daily';
  if (c.isElite) return '🟥 Elite Weekly';
  return '🟨 Weekly';
};

const timeRemaining = (expiryISO: string): string => {
  const now = new Date();
  const expiry = new Date(expiryISO);
  const ms = expiry.getTime() - now.getTime();

  if (ms <= 0) return 'Expired';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!hours && !minutes) parts.push(`${seconds}s`);
  return parts.join(' ');
}

export const nightwave = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/nightwave`);
  const data = await res.json();

  const challenges: NightwaveChallenge[] = data.activeChallenges || [];

  if (!challenges.length) {
    return new EmbedBuilder()
      .setTitle('Nightwave')
      .setDescription('No active challenges.')
      .setColor(0x7289DA)
      .setThumbnail(NIGHTWAVE_ICON);
  }

  const fields = challenges.map(c => ({
    name: `${formatLabel(c)}\n${c.title}`,
    value: `${c.desc}\n⏱️ Ends in: ${timeRemaining(c.expiry)}\n🎯 ${c.reputation} standing\n`,
    inline: true
  }));

  return new EmbedBuilder()
    .setColor(0x7289DA)
    .setTitle('Nightwave Challenges')
    .setDescription(`Active Daily, Weekly, and Elite Weekly Challenges`)
    .addFields(fields)
    .setThumbnail(NIGHTWAVE_ICON);
};