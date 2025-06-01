import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

/**
 * Fetches Baro Ki'Teer's location and returns an embed.
 */
export const getBaroKiteerLocation = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/voidTrader`);
    const data = await res.json();

    const isActive = data.active;
    const title = "Baro Ki'Teer - Void Trader";
    const thumbnail = 'https://wiki.warframe.com/images/thumb/TennoCon2020BaroCropped.png/300px-TennoCon2020BaroCropped.png';

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOR.orange)
      .setTitle(title)
      .setThumbnail(thumbnail);

    if (isActive) {
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
      .setDescription("Unable to fetch Baro Ki'Teer info right now.");
  }
};