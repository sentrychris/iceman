import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR } from '../config';

/**
 * Known 8-week Steel Path Honors shop rotation.
 */
const TESHIN_ROTATION_ITEMS = [
  'Umbra Forma Blueprint',
  '50,000 Kuva',
  'Kitgun Riven Mod',
  '3x Forma',
  'Zaw Riven Mod',
  '30,000 Endo',
  'Rifle Riven Mod',
  'Shotgun Riven Mod',
];

/**
 * The UTC timestamp of the known cycle start (a Sunday reset).
 */
const ROTATION_START_DATE_UTC = new Date('2025-05-04T00:00:00Z');

/**
 * Calculates the current week's rotation index.
 * @returns Index into the rotation array (0-7)
 */
const getCurrentRotationIndex = (): number => {
  const now = new Date();
  const elapsedWeeks = Math.floor((now.getTime() - ROTATION_START_DATE_UTC.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return elapsedWeeks % TESHIN_ROTATION_ITEMS.length;
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
 * @returns EmbedBuilder
 */
export const buildTeshinRotationEmbed = (): EmbedBuilder => {
  const index = getCurrentRotationIndex();
  const currentItem = TESHIN_ROTATION_ITEMS[index];
  const nextItem = TESHIN_ROTATION_ITEMS[(index + 1) % TESHIN_ROTATION_ITEMS.length];
  const nextReset = getNextResetDateUTC();

  return new EmbedBuilder()
    .setColor(DISCORD_COLOR.orange)
    .setTitle("Teshin - Steel Path Honors")
    .setDescription("This week's rotating item in the Steel Path Honors shop")
    .addFields(
      { name: 'Current Item', value: currentItem, inline: true },
      { name: 'Resets On', value: nextReset, inline: true },
      { name: 'Next Item', value: nextItem, inline: false },
    )
    .setThumbnail('https://wiki.warframe.com/images/Teshin.png')
    .setFooter({ text: 'Rotation is based on known 8-week cycle. Resets every Sunday at 00:00 UTC.' });
};
