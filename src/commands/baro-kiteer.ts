import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON, WARFRAME_API } from '../config';
/**
 * Fetches Baro Ki'Teer's location and returns an embed.
 */
export const buildBaroKiteerLocationEmbed = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/voidTrader?lang=en`);
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOR.orange)
      .setTitle("Baro Ki'Teer - Void Trader")
      .setThumbnail(DISCORD_ICON.baro);

    if (data.active) {
      embed.setDescription(`**Baro Ki'Teer** is currently at **${data.location}** and will depart in **${data.endString}**.`);
    } else {
      embed.setDescription(`**Baro Ki'Teer** will arrive at **${data.location}** in **${data.startString}**.`);
    }

    return embed;
  } catch (err) {
    console.error(err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle("Baro Ki'Teer - Void Trader")
      .setDescription("Unable to fetch Baro Ki'Teer info right now.")
      .setThumbnail(DISCORD_ICON.baro);
  }
};