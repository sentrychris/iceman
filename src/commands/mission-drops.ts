import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR } from '../config';

const DROPS_API_URL = 'https://drops.warframestat.us/data/all.json';
const ITEM_ICON = 'https://wiki.warframe.com/images/Resource_Orange.png';

interface MissionReward {
  itemName: string;
  rarity: string;
  chance: number;
}

interface RotationRewards {
  [rotation: string]: MissionReward[];
}

interface NodeData {
  gameMode: string;
  isEvent: boolean;
  rewards: RotationRewards;
}

interface PlanetRewards {
  [nodeName: string]: NodeData;
}

interface MissionRewards {
  [planetName: string]: PlanetRewards;
}

interface Match {
  planet: string;
  node: string;
  gameMode: string;
  rotation: string;
  reward: MissionReward;
}

export const buildItemDropsEmbed = async (args: string[]): Promise<EmbedBuilder> => {
  const res = await fetch(DROPS_API_URL);
  const data = await res.json();
  const missionRewards: MissionRewards = data.missionRewards;

  // CASE 1: Mission drop query — !wf drops planet [planet] [mission]
  if (args[0]?.toLowerCase() === 'planet' && args.length >= 3) {
    const planetInput = args[1];
    const missionInput = args.slice(2).join(' ');

    const planet = Object.keys(missionRewards).find(
      p => p.toLowerCase() === planetInput.toLowerCase()
    );

    if (!planet) {
      return new EmbedBuilder()
        .setTitle('Mission Drops Lookup')
        .setDescription(`Planet not found: **${planetInput}**`)
        .setColor(DISCORD_COLOR.red)
        .setThumbnail(ITEM_ICON);
    }

    const node = Object.keys(missionRewards[planet]).find(
      n => n.toLowerCase() === missionInput.toLowerCase()
    );

    if (!node) {
      return new EmbedBuilder()
        .setTitle('Mission Drops Lookup')
        .setDescription(`Mission not found on **${planet}**: **${missionInput}**`)
        .setColor(DISCORD_COLOR.red)
        .setThumbnail(ITEM_ICON);
    }

    const nodeData = missionRewards[planet][node];

    const fields = Object.entries(nodeData.rewards)
      .filter(([, rewards]) => Array.isArray(rewards))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([rotation, rewards]) => ({
        name: `Rotation ${rotation}`,
        value: rewards
          .map(r => `**${r.itemName}**\n*${r.rarity}* (${r.chance}%)`)
          .join('\n')
          .slice(0, 1024),
        inline: true,
      }));

    return new EmbedBuilder()
      .setTitle(`${node} — ${planet}`)
      .setDescription(`${nodeData.gameMode} mission rewards`)
      .addFields(fields)
      .setColor(DISCORD_COLOR.orange)
      .setThumbnail(ITEM_ICON)
      .setFooter({ text: 'Data via drops.warframestat.us' });
  }

  // CASE 2: Item drop query — default behavior
  const itemQuery = args.join(' ').toLowerCase();
  const matches: Match[] = [];

  for (const [planet, nodes] of Object.entries(missionRewards)) {
    for (const [node, nodeData] of Object.entries(nodes)) {
      if (!nodeData?.rewards) continue;

      for (const [rotation, rewardList] of Object.entries(nodeData.rewards)) {
        if (!Array.isArray(rewardList)) continue;

        for (const reward of rewardList) {
          if (typeof reward?.itemName !== 'string') continue;

          if (reward.itemName.toLowerCase().includes(itemQuery)) {
            matches.push({
              planet,
              node,
              gameMode: nodeData.gameMode,
              rotation,
              reward,
            });
          }
        }
      }
    }
  }

  if (matches.length === 0) {
    return new EmbedBuilder()
      .setTitle('Item Drop Lookup')
      .setDescription(`No mission drops found for: **${itemQuery}**`)
      .setColor(DISCORD_COLOR.red)
      .setThumbnail(ITEM_ICON);
  }

  const topMatches = matches
    .sort((a, b) => b.reward.chance - a.reward.chance)
    .slice(0, 3);

  const fields = topMatches.map(match => ({
    name: `${match.node} (${match.planet}) — Rotation ${match.rotation}`,
    value:
      `**${match.reward.itemName}**\n` +
      `Rarity: *${match.reward.rarity}*\n` +
      `Chance: ${match.reward.chance}%\n` +
      `Mode: ${match.gameMode}`,
    inline: false,
  }));

  return new EmbedBuilder()
    .setTitle(`Top 3 Drop Sources`)
    .setDescription(`For item - **${itemQuery}**`)
    .addFields(fields)
    .setColor(DISCORD_COLOR.orange)
    .setThumbnail(ITEM_ICON)
    .setFooter({ text: 'Data via drops.warframestat.us' });
};
