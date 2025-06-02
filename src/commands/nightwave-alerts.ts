import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON, WARFRAME_API } from '../config';

interface NightwaveChallenge {
  title: string;
  desc: string;
  reputation: number;
  isDaily: boolean;
  isElite: boolean;
  expiry: string;
  startString: string;
}

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

export const buildNightwaveEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/nightwave?lang=en`);
  const data = await res.json();

  const challenges: NightwaveChallenge[] = data.activeChallenges || [];

  if (!challenges.length) {
    return new EmbedBuilder()
      .setTitle('Nightwave')
      .setDescription('No active challenges.')
      .setColor(DISCORD_COLOR.orange)
      .setThumbnail(DISCORD_ICON.nightwave);
  }

  const group = (type: string, list: NightwaveChallenge[]) => {
    return list.map(c => ({
      name: c.title,
      value:
        `> ${c.desc}\n` +
        `> ⏱️ Ends in: ${timeRemaining(c.expiry)}\n` +
        `> 🎯 ${c.reputation} standing`,
      inline: false,
    }));
  };

  const dailies = group('Daily', challenges.filter(c => c.isDaily));
  const eliteWeeklies = group('Elite Weekly', challenges.filter(c => c.isElite));
  const weeklies = group('Weekly', challenges.filter(c => !c.isElite && !c.isDaily));

  const embed = new EmbedBuilder()
    .setColor(DISCORD_COLOR.orange)
    .setTitle('Nightwave Challenges')
    .setDescription('Active Daily, Weekly, and Elite Weekly Challenges')
    .setThumbnail(DISCORD_ICON.nightwave);

  if (dailies.length) {
    embed.addFields({ name: '🟦 Daily Challenges', value: '\u200b', inline: false }, ...dailies);
  }

  if (weeklies.length) {
    embed.addFields({ name: '🟨 Weekly Challenges', value: '\u200b', inline: false }, ...weeklies);
  }

  if (eliteWeeklies.length) {
    embed.addFields({ name: '🟥 Elite Weekly Challenges', value: '\u200b', inline: false }, ...eliteWeeklies);
  }

  return embed;
};