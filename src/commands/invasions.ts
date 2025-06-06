import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR, DISCORD_ICON, WARFRAME_API } from '../config';

interface InvasionReward {
  asString: string;
  thumbnail?: string;
}

interface Invasion {
  node: string;
  desc: string;
  attackingFaction: string;
  attacker: {
    faction: string;
    reward?: InvasionReward;
  };
  defender: {
    faction: string;
    reward: InvasionReward;
  };
  completed: boolean;
  completion: number;
  eta: string;
  vsInfestation: boolean;
}

const FACTION_ICONS: Record<string, string> = {
  Corpus: 'https://wiki.warframe.com/images/thumb/IconCorpusOn.png/300px-IconCorpusOn.png',
  Grineer: 'https://wiki.warframe.com/images/thumb/IconGrineerOn.png/300px-IconGrineerOn.png',
  Infested: 'https://wiki.warframe.com/images/thumb/FactionsInfested.png/300px-FactionsInfested.png'
};

export const buildInvasionsEmbed = async (
  { title, footer }: { title?: string; footer?: string } = {}
): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(`${WARFRAME_API}/invasions?lang=en`);
    const data: Invasion[] = await res.json();

    const active = data.filter(inv => !inv.completed).sort((a, b) => b.completion - a.completion);

    if (!active.length) {
      return new EmbedBuilder()
        .setColor(DISCORD_COLOR.purple)
        .setTitle(title ?? 'Invasions')
        .setDescription('There are currently no active invasions.');
    }

    // Use the first active invasion's attacking faction as the embed thumbnail
    const attackingFactionIcon = FACTION_ICONS[active[0].attackingFaction] ?? DISCORD_ICON.clan;

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOR.purple)
      .setTitle(title ?? 'Invasions')
      .setDescription('Ongoing conflicts across the Origin System')
      .setThumbnail(attackingFactionIcon)
      .setFooter({
        text:
          'Source: warframestat.us — Invasions resolve once a side reaches 100%.\n' +
          (footer ?? ''),
      });

    for (const invasion of active) {
      const attackerReward = invasion.attacker.reward?.asString ?? 'No reward';
      const defenderReward = invasion.defender.reward?.asString ?? 'No reward';
      const attackerFaction = invasion.attacker.faction;
      const defenderFaction = invasion.defender.faction;

      embed.addFields({
        name: `${invasion.node} — ${invasion.desc}`,
        value:
          `**${attackerFaction} vs ${defenderFaction}**\n` +
          `🎁 **${attackerFaction}**: ${attackerReward}\n` +
          `🎁 **${defenderFaction}**: ${defenderReward}\n` +
          `⏱️ **ETA**: ${invasion.eta} | **Completion**: ${invasion.completion.toFixed(1)}%`,
        inline: false,
      });
    }

    return embed;
  } catch (err) {
    console.error('Failed to fetch invasions:', err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Invasions')
      .setDescription('Unable to fetch invasion data at this time.');
  }
};
