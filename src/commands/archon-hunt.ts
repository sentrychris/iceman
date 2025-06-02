import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

const ARCHON_IMAGES: Record<string, string> = {
  'Archon Amar': 'https://wiki.warframe.com/images/thumb/ArchonAmar.png/300px-ArchonAmar.png',
  'Archon Nira': 'https://wiki.warframe.com/images/thumb/ArchonNira.png/300px-ArchonNira.png',
  'Archon Boreal': 'https://wiki.warframe.com/images/thumb/ArchonBoreal.png/300px-ArchonBoreal.png',
};

interface ArchonMission {
  node: string;
  type: string;
}

interface ArchonHuntData {
  boss: string;
  faction: string;
  eta: string;
  missions: ArchonMission[];
  expired: boolean;
  active: boolean;
}

/**
 * Fetches the current Archon Hunt and builds a Discord embed.
 */
export const buildArchonHuntEmbed = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/archonHunt?lang=en`);
    const data: ArchonHuntData = await res.json();

    if (!data.active || data.expired) {
      return new EmbedBuilder()
        .setColor(DISCORD_COLOR.red)
        .setTitle('Archon Hunt')
        .setDescription('No active Archon Hunt found.')
    }

    const image = ARCHON_IMAGES[data.boss] ?? ARCHON_IMAGES['Archon Nira'];

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Archon Hunt')
      .setDescription(`This week's Archon Hunt is against **${data.boss}**`)
      .setThumbnail(image)
      .addFields(
        { name: 'Boss', value: data.boss, inline: true },
        { name: 'Faction', value: data.faction, inline: true },
        { name: 'Time Remaining', value: data.eta, inline: true },
      );

    data.missions.forEach((mission, index) => {
      embed.addFields({
        name: `Stage ${index + 1}: ${mission.type}`,
        value: `**Node**: ${mission.node}`,
        inline: false,
      });
    });

    return embed;
  } catch (error) {
    console.error('Failed to fetch Archon Hunt:', error);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Archon Hunt')
      .setDescription('Unable to fetch Archon Hunt information at this time.');
  }
};
