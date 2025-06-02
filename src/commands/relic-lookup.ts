import { EmbedBuilder } from 'discord.js';

const DROPS_API_URL = 'https://drops.warframestat.us/data/all.json';
const RELIC_ICON = 'https://wiki.warframe.com/images/thumb/VoidRelicPack.png/300px-VoidRelicPack.png';

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

  // Group relics by tier+name, keeping the best drop chance
  const bestDrops: Record<string, { relic: Relic; reward: RelicReward }> = {};

  for (const relic of data.relics as Relic[]) {
    for (const reward of relic.rewards) {
      if (!reward.itemName.toLowerCase().includes(normalizedQuery)) continue;

      const key = `${relic.tier} ${relic.relicName}`;
      if (!bestDrops[key] || reward.chance > bestDrops[key].reward.chance) {
        bestDrops[key] = { relic, reward };
      }
    }
  }

  const entries = Object.values(bestDrops);
  if (entries.length === 0) {
    return new EmbedBuilder()
      .setTitle('Relic Drop Lookup')
      .setDescription(`No relics found dropping: **${query}**`)
      .setColor('Red');
  }

  const fields = entries
    .sort((a, b) => b.reward.chance - a.reward.chance)
    .slice(0, 25)
    .map(({ relic, reward }) => ({
      name: `${relic.tier} ${relic.relicName}`,
      value: `• **${reward.itemName}**\nRefine to **${relic.state.toLowerCase()}**, drop will be ${reward.rarity}.\nBest drop chance: ${reward.chance}%`,
      inline: false
    }));

  return new EmbedBuilder()
    .setTitle('Relic Drop Lookup')
    .setDescription(`Relics that contain: **${query}**`)
    .setColor('Gold')
    .setThumbnail(RELIC_ICON)
    .addFields(fields)
    .setFooter({ text: 'Best drop chance shown per relic name. Data via drops.warframestat.us' });
};
