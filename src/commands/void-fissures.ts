import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, WARFRAME_API } from '../config';

const VOID_ICON = 'https://wiki.warframe.com/images/thumb/VoidSkybox.jpg/244px-VoidSkybox.jpg';

interface Fissure {
  node: string;
  missionType: string;
  tier: string;
  isHard: boolean;
  isStorm: boolean;
  expiry: string;
}

function formatFissure(f: Fissure): string {
  const modifiers = [];
  if (f.isHard) modifiers.push('Steel Path');
  if (f.isStorm) modifiers.push('Void Storm');
  const mods = modifiers.length ? ` (${modifiers.join(', ')})` : '';
  return `• ${f.node} - ${f.missionType}${mods}`;
}

function groupByTier(fissures: Fissure[]): Map<string, Fissure[]> {
  return fissures.reduce((map, f) => {
    if (!map.has(f.tier)) map.set(f.tier, []);
    map.get(f.tier)!.push(f);
    return map;
  }, new Map<string, Fissure[]>());
}

export const buildVoidFissuresEmbed = async (): Promise<EmbedBuilder> => {
  const res = await fetch(`${WARFRAME_API}/fissures`);
  const fissures: Fissure[] = await res.json();

  if (!fissures.length) {
    return new EmbedBuilder()
      .setTitle('Void Fissures')
      .setDescription('No active fissures.')
      .setColor(DISCORD_COLOR.blue)
      .setThumbnail(VOID_ICON);
  }

  const grouped = groupByTier(fissures);

  const fields = Array.from(grouped.entries()).map(([tier, entries]) => ({
    name: tier,
    value: entries.map(formatFissure).join('\n'),
    inline: false,
  }));

  return new EmbedBuilder()
    .setTitle('Active Void Fissures')
    .setColor(DISCORD_COLOR.blue)
    .setThumbnail(VOID_ICON)
    .addFields(fields);
};
