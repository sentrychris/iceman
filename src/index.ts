import type { Message, TextChannel } from 'discord.js';
import { usage } from './usage';
import { buildBaroKiteerLocationEmbed } from './commands/baro-kiteer';
import { buildNightwaveEmbed } from './commands/nightwave-alerts';
import { buildVoidFissuresEmbed } from './commands/void-fissures';
import { buildWorldCyclesEmbed } from './commands/world-cycles';
import { buildSortieEmbed } from './commands/sortie-mission';
import { buildArchonHuntEmbed } from './commands/archon-hunt';
import { buildClanPrizeDrawEmbed } from './commands/clan-prizedraw';
import { buildTeshinRotationEmbed } from './commands/teshin-rotation';
import { buildMarketPriceEmbed, getWarframeMarketCheapestSellOrder } from './commands/waframe-market';
import { client, DISCORD_PREFIX, FOUNDING_WARLORD_USER_ID, CLAN_ANNOUNCEMENTS_CHANNEL } from './config';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(DISCORD_PREFIX) || message.author.bot) {
    return;
  }

  // Show usage help
  await usage(message);

  // Show Baro Ki'Teer void trader location
  if (message.content === `${DISCORD_PREFIX} baro` || message.content === `${DISCORD_PREFIX} vt`) {
    message.reply({ embeds: [await buildBaroKiteerLocationEmbed()]});
  }

  // Show Nightwave daily & weekly alerts
  if (message.content === `${DISCORD_PREFIX} nightwave` || message.content === `${DISCORD_PREFIX} nw`) {
    message.reply({ embeds: [await buildNightwaveEmbed()] });
  }

  // Show active void fissures
  if (message.content.startsWith(`${DISCORD_PREFIX} fissures`) || message.content.startsWith(`${DISCORD_PREFIX} vf`)) {
    const parts = message.content.trim().split(/\s+/);
    const tierFilter = parts.length > 2 ? parts.slice(2).join(' ') : parts[1]; // support '!wf fissures meso' or '!wf vf meso'

    const knownTiers = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'];
    const isTier = tierFilter && knownTiers.some(t => t.toLowerCase() === tierFilter.toLowerCase());

    const embed = await buildVoidFissuresEmbed(isTier ? tierFilter : undefined);
    message.reply({ embeds: [embed] });
  }

  // Show current world cycles
  if (/^!wf\s+(world|wc)(\s+.+)?$/i.test(message.content)) {
    const match = message.content.match(/^!wf\s+(world|wc)(?:\s+(.+))?/i);
    let filter = match?.[2]?.trim().toLowerCase();

    if (filter) {
      // Normalize filter aliases
      if (filter.includes('orb')) filter = 'vallis';
      else if (filter.includes('deimos') || filter.includes('cambion')) filter = 'cambion';
      else if (filter.includes('earth') || filter.includes('cetus')) filter = 'cetus';
      else filter = undefined; // fallback if unrecognized
    }

    const embed = await buildWorldCyclesEmbed(filter);
    return message.reply({ embeds: Array.isArray(embed) ? embed : [embed] });
  }

  // Show the daily active sortie mission
  if (message.content === `${DISCORD_PREFIX} sortie`) {
    return message.reply({ embeds: [await buildSortieEmbed()] });
  }

  // Show the weekly active archon hunt mission
  if (message.content === `${DISCORD_PREFIX} archon`) {
    message.reply({ embeds: [await buildArchonHuntEmbed()] });
  }

  // Show steel path honors shop rotation and evergreen offerings
  if (message.content === `${DISCORD_PREFIX} teshin` || message.content === `${DISCORD_PREFIX} sp`) {
    return message.reply({ embeds: [await buildTeshinRotationEmbed()] });
  }

  // Show cheapest sell order for an item from warframe.market
  if (/^!wf\s+(buy|wtb)\s+/i.test(message.content)) {
    const query = message.content.replace(/^!wf\s+(buy|wtb)\s+/i, '').trim();
    const slug = query.toLowerCase().replace(/\s+/g, '_');
    const displayName = query.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const order = await getWarframeMarketCheapestSellOrder(slug);

    if (!order) {
      return message.reply(`No active sell orders found for **${displayName}**.`);
    }

    return message.reply({ embeds: [buildMarketPriceEmbed(displayName, slug, order)] });
  }

  // Run the clan prizedraw
  if (message.content === `${DISCORD_PREFIX} prizedraw`) {
    if (message.author.id !== FOUNDING_WARLORD_USER_ID) {
      console.warn(`${message.author.displayName} attempted !wf prizedraw`);
      return;
    }

    const channel = await client.channels.fetch(CLAN_ANNOUNCEMENTS_CHANNEL);

    if (!channel || !channel.isTextBased()) {
      console.error('Invalid or non-text channel for prize draw');
      return;
    }

    await (channel as TextChannel).send({
      embeds: [await buildClanPrizeDrawEmbed()],
    });
  }
});
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);