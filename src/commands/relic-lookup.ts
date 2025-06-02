import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON } from '../config';

const DROPS_API_URL = 'https://drops.warframestat.us/data/all.json';

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

interface RelicReward {
  itemName: string;
  rarity: string;
  chance: number;
}

interface Relic {
  tier: string;
  relicName: string;
  state: string;
  rewards: RelicReward[];
}

export const buildRelicDropsEmbed = async (query: string): Promise<EmbedBuilder> => {
  const res = await fetch(DROPS_API_URL);
  const data = await res.json();

  const normalizedQuery = query.toLowerCase();

  // Step 1: Collect live (unvaulted) relics
  const liveRelicSet = new Set<string>();
  const missionRewards: MissionRewards = data.missionRewards;

  for (const planet of Object.values(missionRewards)) {
    for (const node of Object.values(planet)) {
      if (!node || typeof node !== 'object' || !node.rewards) continue;

      for (const rotationRewards of Object.values(node.rewards)) {
        if (!Array.isArray(rotationRewards)) continue;

        for (const reward of rotationRewards) {
          const name = reward.itemName?.toLowerCase();
          if (name?.includes('relic')) {
            const clean = name.replace(/ relic$/i, '').trim();
            liveRelicSet.add(clean);
          }
        }
      }
    }
  }

  // Step 2: Match relics to query and mark vaulted status
  const allMatches: { relic: Relic; reward: RelicReward; isVaulted: boolean }[] = [];

  for (const relic of data.relics as Relic[]) {
    for (const reward of relic.rewards) {
      if (!reward.itemName.toLowerCase().includes(normalizedQuery)) continue;

      const key = `${relic.tier} ${relic.relicName}`;
      const isVaulted = !liveRelicSet.has(key.toLowerCase());

      allMatches.push({ relic, reward, isVaulted });
    }
  }

  if (allMatches.length === 0) {
    return new EmbedBuilder()
      .setTitle('Relic Drop Lookup')
      .setDescription(`No relics found dropping: **${query}**`)
      .setColor(DISCORD_COLOR.red);
  }

  const unvaulted = allMatches.filter(e => !e.isVaulted);

  if (unvaulted.length === 0) {
    return new EmbedBuilder()
      .setTitle('Relic Drop Lookup')
      .setDescription(`Relics that contain: **${query}**`)
      .setColor(DISCORD_COLOR.red)
      .setThumbnail(DISCORD_ICON.relic)
      .addFields([
        {
          name: 'All relics are vaulted',
          value: 'This item only drops from relics that are no longer in the current drop table.',
          inline: false,
        }
      ])
      .setFooter({ text: 'Data via drops.warframestat.us' });
  }

  // Step 3: Deduplicate unvaulted relics by name, keep best chance
  const deduped = new Map<string, { relic: Relic; reward: RelicReward }>();
  for (const entry of unvaulted) {
    const key = `${entry.relic.tier} ${entry.relic.relicName}`;
    if (!deduped.has(key) || entry.reward.chance > deduped.get(key)!.reward.chance) {
      deduped.set(key, { relic: entry.relic, reward: entry.reward });
    }
  }

  const fields = Array.from(deduped.values())
    .sort((a, b) => b.reward.chance - a.reward.chance)
    .slice(0, 25)
    .map(({ relic, reward }) => ({
      name: `${relic.tier} ${relic.relicName}`,
      value:
        `**${reward.itemName}**\n` +
        `Refine to **${relic.state.toLowerCase()}** for **${reward.rarity.toLowerCase()}** drop.\n` +
        `Refined drop chance: ${reward.chance}%`,
      inline: false,
    }));

  return new EmbedBuilder()
    .setTitle('Relic Drop Lookup')
    .setDescription(`Relics that contain: **${query}**`)
    .setColor(DISCORD_COLOR.orange)
    .setThumbnail(DISCORD_ICON.relic)
    .addFields(fields)
    .setFooter({ text: 'Data via drops.warframestat.us' });
};
