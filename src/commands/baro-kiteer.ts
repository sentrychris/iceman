import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

/**
 * Fetches Baro Ki'Teer's location and returns an embed with field-based layout.
 */
export const getBaroKiteerLocation = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/voidTrader`);
    const data = await res.json();

    const isActive = data.active;
    const title = "Baro Ki'Teer — Void Trader";
    const color = 0xE67E22;
    const thumbnail = 'https://wiki.warframe.com/images/thumb/TennoCon2020BaroCropped.png/300px-TennoCon2020BaroCropped.png';

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setThumbnail(thumbnail);

    if (isActive) {
      embed.addFields(
        { name: 'Departing From', value: data.location, inline: true },
        { name: 'Departing In', value: data.endString, inline: true }
      );
    } else {
      embed.addFields(
        { name: 'Arriving At', value: data.location, inline: true },
        { name: 'Arriving In', value: data.startString, inline: true }
      );
    }

    return embed;
  } catch (err) {
    console.error(err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle("Baro Ki'Teer — Void Trader")
      .setDescription("Unable to fetch Baro Ki'Teer info right now.");
  }
};
