import type { Message, TextChannel } from 'discord.js';
import { getBaroKiteerLocation } from './commands/baro-kiteer';
import { buildNightwaveEmbed } from './commands/nightwave';
import { buildVoidFissuresEmbed } from './commands/void-fissures';
import { buildClanPrizeDrawEmbed } from './commands/clan-prizedraw';
import {
  buildCetusWorldCycleEmbed,
  buildCambionDriftWorldCycleEmbed,
  buildOrbVallisWorldCycleEmbed
} from './commands/world-cycles';
import {
  buildMarketPriceEmbed,
  getWarframeMarketCheapestSellOrder
} from './commands/warframe-market/market-price';
import {
  client,
  FOUNDING_WARLORD_USER_ID,
  DISCORD_PREFIX,
  CLAN_ANNOUNCEMENTS_CHANNEL
} from './config';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(DISCORD_PREFIX) || message.author.bot) {
    return;
  }

  /**
   * World cycle timers
   */
  if (message.content === `${DISCORD_PREFIX} world` || message.content === `${DISCORD_PREFIX} cycles`) {
    const [cetusEmbed, cambionEmbed, vallisEmbed] = await Promise.all([
      buildCetusWorldCycleEmbed(),
      buildCambionDriftWorldCycleEmbed(),
      buildOrbVallisWorldCycleEmbed(),
    ]);
  
    message.reply({
      embeds: [cetusEmbed, cambionEmbed, vallisEmbed]
    });
  }

  /**
   * Baro Ki'Teer void trader location
   */
  if (message.content === `${DISCORD_PREFIX} baro`) {
    message.reply(await getBaroKiteerLocation());
  }

  /**
   * Nightwave daily & weekly alerts
   */
  if (message.content === `${DISCORD_PREFIX} nightwave`) {
    message.reply({ embeds: [await buildNightwaveEmbed()] });
  }

  /**
   * Active void fissures
   */
  if (message.content === `${DISCORD_PREFIX} fissures`) {
    message.reply({ embeds: [await buildVoidFissuresEmbed()] });
  }

  /**
   * Clan prize draw (founding warlord only)
   */
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
      embeds: [buildClanPrizeDrawEmbed()],
    });
  }

  /**
   * Warframe market cheapest sell order
   */
  if (message.content.startsWith(`${DISCORD_PREFIX} buy `)) {
      const input = message.content.slice(`${DISCORD_PREFIX} buy `.length).trim();
      const slug = input.toLowerCase().replace(/\s+/g, '_');
      const displayName = input.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Title Case

    const order = await getWarframeMarketCheapestSellOrder(slug);

    if (!order) {
      return message.reply(`No active sell orders found for **${displayName}**.`);
    }

    return message.reply({ embeds: [buildMarketPriceEmbed(displayName, order)] });
  }
});
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);