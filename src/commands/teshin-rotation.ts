import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR } from '../config';

const TESHIN_ICON = 'https://wiki.warframe.com/images/Teshin.png';

/**
 * Known 8-week Steel Path Honors shop rotation.
 */
const TESHIN_ROTATION_ITEMS: Record<string, number> = {
  'Umbra Forma Blueprint': 150,
  '50,000 Kuva': 15,
  'Kitgun Riven Mod': 75,
  '3x Forma': 75,
  'Zaw Riven Mod': 75,
  '30,000 Endo': 150,
  'Rifle Riven Mod': 75,
  'Shotgun Riven Mod': 75,
};

const TESHIN_ROTATION_ARRAY = Object.entries(TESHIN_ROTATION_ITEMS);

/**
 * The UTC timestamp of the known cycle start (a Sunday reset).
 */
const ROTATION_START_DATE_UTC = new Date('2025-05-04T00:00:00Z');

/**
 * Calculates the current week's rotation index.
 */
const getCurrentRotationIndex = (): number => {
  const now = new Date();
  const elapsedWeeks = Math.floor((now.getTime() - ROTATION_START_DATE_UTC.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return elapsedWeeks % TESHIN_ROTATION_ARRAY.length;
};

/**
 * Returns the ISO date of the next Sunday reset.
 */
const getNextResetDateUTC = (): string => {
  const now = new Date();
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + ((7 - now.getUTCDay()) % 7));
  next.setUTCHours(0, 0, 0, 0);
  return next.toUTCString();
};

/**
 * Builds an embed showing Teshin's current weekly item rotation.
 */
export const buildTeshinRotationEmbed = (): EmbedBuilder => {
  const index = getCurrentRotationIndex();
  const [currentItem, currentCost] = TESHIN_ROTATION_ARRAY[index];
  const [nextItem, nextCost] = TESHIN_ROTATION_ARRAY[(index + 1) % TESHIN_ROTATION_ARRAY.length];
  const nextReset = getNextResetDateUTC();

  return new EmbedBuilder()
    .setColor(DISCORD_COLOR.orange)
    .setTitle('Teshin — Steel Path Honors')
    .setDescription('This week’s rotating item in the Steel Path Honors shop')
    .addFields(
      { name: 'Current Item', value: `${currentItem}\n🪙 ${currentCost} Steel Essence`, inline: true },
      { name: 'Resets On', value: nextReset, inline: true },
      { name: 'Next Item', value: `${nextItem}\n🪙 ${nextCost} Steel Essence`, inline: false },
    )
    .setThumbnail(TESHIN_ICON)
    .setFooter({ text: 'Rotation is based on known 8-week cycle. Resets every Sunday at 00:00 UTC.' });
};
