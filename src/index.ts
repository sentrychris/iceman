import { Message } from 'discord.js';
import { client, FOUNDING_WARLORD_USER_ID, DISCORD_PREFIX } from './config';
import { baroKiteerLocation } from './commands/baro-kiteer';
import { nightwave } from './commands/nightwave';
import { voidFissures } from './commands/void-fissures';
import {
  cetus,
  cambionDrift,
  orbVallis,
  startWorldCycleTrackingLoop
} from './commands/world-cycles';
import { clanPrizeDraw } from './commands/clan-prizedraw';
  
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

    message.reply({ embeds: [clanPrizeDraw()] });
  }
});

/**
 * World cycle loop
 */
// startWorldCycleTrackingLoop(client);
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);