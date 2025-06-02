import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON } from '../config';
import { readFile } from 'fs/promises';
import path from 'path';

type PrizeDrawResult = {
  user: string;
  prize: string;
};

/**
 * Loads eligible members and prizes from disk
 */
const loadClanPrizeData = async (): Promise<{ members: string[]; prizes: string[] }> => {
  const base = path.resolve(__dirname, '../../storage/clan');

  const [membersRaw, prizesRaw] = await Promise.all([
    readFile(path.join(base, 'members.json'), 'utf-8'),
    readFile(path.join(base, 'prizes.json'), 'utf-8')
  ]);

  const members = JSON.parse(membersRaw);
  const prizes = JSON.parse(prizesRaw);

  if (!Array.isArray(members) || !Array.isArray(prizes)) {
    throw new Error('Invalid clan data format.');
  }

  return { members, prizes };
};

/**
 * Picks a random member and prize
 */
const clanPrizeDraw = (members: string[], prizes: string[]): PrizeDrawResult => {
  return {
    user: members[Math.floor(Math.random() * members.length)].trim(),
    prize: prizes[Math.floor(Math.random() * prizes.length)]
  };
};

/**
 * Builds an embed for clan prize draw
 */
export const buildClanPrizeDrawEmbed = async (): Promise<EmbedBuilder> => {
  const { members, prizes } = await loadClanPrizeData();
  const { user, prize } = clanPrizeDraw(members, prizes);

  return new EmbedBuilder()
    .setColor(DISCORD_COLOR.purple)
    .setTitle('Clan Monthly Giveaway Prize Draw')
    .setDescription('Congratulations to our winner! Your prize will be gifted to you through the in-game market.')
    .addFields(
      { name: 'Member', value: user, inline: true },
      { name: 'Prize', value: prize, inline: true }
    )
    .setThumbnail(DISCORD_ICON.clan);
};
