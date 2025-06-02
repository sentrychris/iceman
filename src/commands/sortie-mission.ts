import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

const SORTIE_ICON = 'https://wiki.warframe.com/images/Sortie_b.png';

/**
 * Builds an embed showing today's Sortie details.
 */
export const buildSortieEmbed = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/sortie?lang=en`);
    const data = await res.json();

    const {
      boss,
      faction,
      eta,
      startString,
      variants
    } = data;

    const missionFields = variants.map((mission: any, index: number) => ({
      name: `Mission ${index + 1}: ${mission.missionTypeKey}`,
      value:
        `📍 **Location**: ${mission.nodeKey}\n` +
        `🧬 **Modifier**: ${mission.modifier}\n` +
        `📝 ${mission.modifierDescription}`,
      inline: false
    }));

    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.orange)
      .setTitle('Sortie — Daily Missions')
      .setThumbnail(SORTIE_ICON)
      .setDescription(`🧟 **Boss**: ${boss}\n⚔️ **Faction**: ${faction}`)
      .addFields(
        ...missionFields,
        { name: 'Started', value: startString, inline: true },
        { name: 'Time Remaining', value: eta, inline: true }
      )
      .setFooter({
        text: 'Source: warframestat.us — Resets daily at 16:00 UTC',
      });
  } catch (err) {
    console.error('Failed to fetch sortie:', err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Sortie — Daily Missions')
      .setDescription('Unable to fetch sortie data at this time.');
  }
};