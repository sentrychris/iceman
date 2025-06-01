import { EmbedBuilder, Message } from 'discord.js';
import { client, FOUNDING_WARLORD_USER_ID, DISCORD_PREFIX } from './config';
import { baroKiteerLocation } from './commands/baro-kiteer';
import { nightwave } from './commands/nightwave';
import { voidFissures } from './commands/void-fissures';
import { cetus, cambionDrift, orbVallis, startWorldCycleTrackingLoop } from './commands/world-cycles';
import { buildMarketPriceEmbed, getWarframeMarketCheapestSellOrder } from './commands/warframe-market/market-price';
import { buildClanPrizeDrawEmbed, startClanPrizeDrawLoop } from './commands/clan-prizedraw';
  
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
      cetus(),
      cambionDrift(),
      orbVallis(),
    ]);
  
    message.reply({
      embeds: [cetusEmbed, cambionEmbed, vallisEmbed]
    });
  }

  /**
   * Baro kiteer
   */
  if (message.content === `${DISCORD_PREFIX} baro`) {
    message.reply(await baroKiteerLocation());
  }

  /**
   * Nightwave
   */
  if (message.content === `${DISCORD_PREFIX} nightwave`) {
    message.reply({ embeds: [await nightwave()] });
  }

  /**
   * Void fissures
   */
  if (message.content === `${DISCORD_PREFIX} fissures`) {
    message.reply({ embeds: [await voidFissures()] });
  }

  /**
   * Prize draw
   */
  if (message.content === `${DISCORD_PREFIX} prizedraw`) {
    if (message.author.id !== FOUNDING_WARLORD_USER_ID) {
      console.warn(`${message.author.displayName} attempted !wf prizedraw`);
      return;
    }

    message.reply({ embeds: [buildClanPrizeDrawEmbed()] });
  }

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

/**
 * Loops
 */
// startWorldCycleTrackingLoop(client);
// startClanPrizeDrawLoop(client);
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);