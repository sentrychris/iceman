import type { Message, TextChannel } from 'discord.js';

import { usage } from './usage';
import { setupWorldCycleLoop } from './loops/world-cycle-loop';
import { setupSortieMissionLoop } from './loops/sortie-mission-loop';
import { buildBaroKiteerLocationEmbed } from './commands/baro-kiteer';
import { buildNightwaveEmbed } from './commands/nightwave-alerts';
import { buildVoidFissuresEmbed } from './commands/void-fissures';
import { buildWorldCyclesEmbed } from './commands/world-cycles';
import { buildSortieEmbed } from './commands/sortie-mission';
import { buildArchonHuntEmbed } from './commands/archon-hunt';
import { buildRelicDropsEmbed } from './commands/relic-lookup';
import { buildItemDropsEmbed } from './commands/mission-drops';
import { buildClanPrizeDrawEmbed } from './commands/clan-prizedraw';
import { buildTeshinRotationEmbed } from './commands/teshin-rotation';
import { buildMemeframeEmbed } from './commands/wf-memeframe';
import { buildMarketPriceEmbed, getWarframeMarketCheapestSellOrder } from './commands/waframe-market';
import { client, DISCORD_PREFIX, FOUNDING_WARLORD_USER_ID, CLAN_ANNOUNCEMENTS_CHANNEL_ID } from './config';
import { setupArchonHuntLoop } from './loops/archon-hunt-loop';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(DISCORD_PREFIX) || message.author.bot) {
    return;
  }

  /**
   * Command prefix e.g. `!wf`
   */
  const PREFIX_REGEX = DISCORD_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape for regex

  /**
   * Show bot usage
   */
  await usage(message);

  /**
   * Show Baro Ki'Teer current location and arrival/departure times
   */
  if (message.content === `${DISCORD_PREFIX} baro` || message.content === `${DISCORD_PREFIX} vt`) {
    return message.reply({ embeds: [await buildBaroKiteerLocationEmbed()] });
  }

  /**
   * Show Nightwave active daily and weekly alerts
   */
  if (message.content === `${DISCORD_PREFIX} nightwave` || message.content === `${DISCORD_PREFIX} nw`) {
    return message.reply({ embeds: [await buildNightwaveEmbed()] });
  }

  /**
   * Show active Void Fissures. Optional filter by era/tier
   */
  if (message.content.startsWith(`${DISCORD_PREFIX} fissures`) || message.content.startsWith(`${DISCORD_PREFIX} vf`)) {
    const parts = message.content.trim().split(/\s+/);
    const tierFilter = parts.length > 2 ? parts.slice(2).join(' ') : parts[1];

    const knownTiers = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'];
    const isTier = tierFilter && knownTiers.some(t => t.toLowerCase() === tierFilter.toLowerCase());

    return message.reply({ embeds: [await buildVoidFissuresEmbed(isTier ? tierFilter : undefined)] });
  }

  /**
   * Show current cycles for Cetus, Cambion Drift and Orb Vallis
   */
  if (new RegExp(`^${PREFIX_REGEX}\\s+(world|wc)(\\s+.+)?$`, 'i').test(message.content)) {
    const match = message.content.match(new RegExp(`^${PREFIX_REGEX}\\s+(world|wc)(?:\\s+(.+))?`, 'i'));
    let filter = match?.[2]?.trim().toLowerCase();

    if (filter) {
      if (filter.includes('orb') || filter.includes('vallis')) filter = 'vallis';
      else if (filter.includes('deimos') || filter.includes('cambion')) filter = 'cambion';
      else if (filter.includes('earth') || filter.includes('cetus')) filter = 'cetus';
      else filter = undefined;
    }

    const embed = await buildWorldCyclesEmbed(filter);
    return message.reply({ embeds: Array.isArray(embed) ? embed : [embed] });
  }

  /**
   * Show active Sortie mission
   */
  if (message.content === `${DISCORD_PREFIX} sortie`) {
    return message.reply({ embeds: [await buildSortieEmbed()] });
  }

  /**
   * Show active Archon Hunt mission
   */
  if (message.content === `${DISCORD_PREFIX} archon`) {
    return message.reply({ embeds: [await buildArchonHuntEmbed()] });
  }

  /**
   * Show current SP Honors rotation and evergreen offerings from Teshin
   */
  if (message.content === `${DISCORD_PREFIX} teshin` || message.content === `${DISCORD_PREFIX} sp`) {
    return message.reply({ embeds: [await buildTeshinRotationEmbed()] });
  }

  /**
   * Show cheapest current sell-order for given item
   */
  if (new RegExp(`^${PREFIX_REGEX}\\s+(buy|wtb)\\s+`, 'i').test(message.content)) {
    const query = message.content.replace(new RegExp(`^${PREFIX_REGEX}\\s+(buy|wtb)\\s+`, 'i'), '').trim();
    const slug = query.toLowerCase().replace(/\s+/g, '_');
    const displayName = query.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const order = await getWarframeMarketCheapestSellOrder(slug);

    if (!order) {
      return message.reply(`No active sell orders found for **${displayName}**.`);
    }

    return message.reply({ embeds: [buildMarketPriceEmbed(displayName, slug, order)] });
  }

  /**
   * Run a clan prizedraw. Bot will post to announcements channel
   */
  if (message.content === `${DISCORD_PREFIX} prizedraw`) {
    if (message.author.id !== FOUNDING_WARLORD_USER_ID) {
      console.warn(`${message.author.displayName} attempted ${DISCORD_PREFIX}prizedraw`);
      return;
    }

    const channel = await client.channels.fetch(CLAN_ANNOUNCEMENTS_CHANNEL_ID);

    if (!channel || !channel.isTextBased()) {
      console.error('Invalid or non-text channel for prize draw');
      return;
    }

    await (channel as TextChannel).send({
      embeds: [await buildClanPrizeDrawEmbed()],
    });
  }

  /**
   * Show relics for given item with best refinement level and drop chance
   */
  if (new RegExp(`^${PREFIX_REGEX}\\s+(relics|relic)\\s+`, 'i').test(message.content)) {
    const query = message.content.replace(new RegExp(`^${PREFIX_REGEX}\\s+(relics|relic)\\s+`, 'i'), '').trim();
    if (!query) {
      return message.reply(`Specify the item you want to look up in relics. Example: \`${DISCORD_PREFIX} relics trinity prime systems\``);
    }

    return message.reply({ embeds: [await buildRelicDropsEmbed(query)] });
  }

  /**
   * Show mission drop rewards or item drop sources.
   */
  if (new RegExp(`^${PREFIX_REGEX}\\s+drops\\s+`, 'i').test(message.content)) {
    const args = message.content.trim().split(/\s+/).slice(2);

    return message.reply({ embeds: [await buildItemDropsEmbed(args)] });
  }

  /**
   * Post a random meme from r/memeframe
   */
  if (message.content === `${DISCORD_PREFIX} memeframe`) {
    return message.reply({ embeds: [await buildMemeframeEmbed()] });
  }
});

/**
 * Setup self-updating messages
 */
setupWorldCycleLoop(client);

setTimeout(() => {
  setupArchonHuntLoop(client);
}, 1000);

setTimeout(() => {
  setupSortieMissionLoop(client);
}, 2000);
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);