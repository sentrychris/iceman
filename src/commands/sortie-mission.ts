import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON, WARFRAME_API } from '../config';

/**
 * Builds an embed showing today's Sortie details.
 */
export const buildSortieEmbed = async (
  { title, footer }: { title?: string, footer?: string } = {}
): Promise<EmbedBuilder> => {
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

    const embedTitle = title ?? 'Sortie — Daily Missions';
    const sortieFooter = 'Source: warframestat.us — Resets daily at 16:00 UTC\n';
    const embedFooter = footer ? sortieFooter + footer : sortieFooter;

    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.orange)
      .setTitle(embedTitle)
      .setDescription(`🧟 **Boss**: ${boss}\n⚔️ **Faction**: ${faction}`)
      .setThumbnail(DISCORD_ICON.sortie)
      .addFields(
        ...missionFields,
        { name: 'Started', value: startString, inline: true },
        { name: 'Time Remaining', value: eta, inline: true }
      )
      .setFooter({ text: embedFooter });
  } catch (err) {
    console.error('Failed to fetch sortie:', err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Sortie — Daily Missions')
      .setDescription('Unable to fetch sortie data at this time.')
      .setThumbnail(DISCORD_ICON.sortie);
  }
};