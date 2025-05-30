import { Message } from 'discord.js';
import { client, PREFIX } from './config';
import { baroKiteerLocation } from './commands/baro-kiteer';
import { nightwave } from './commands/nightwave';
import { voidFissures } from './commands/void-fissures';
import {
  cetus,
  cambionDrift,
  orbVallis,
  startWorldCycleTrackingLoop
} from './commands/world-cycles';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    return;
  }

  /**
   * World cycle timers
   */
  if (message.content === `${PREFIX} world` || message.content === `${PREFIX} cycles`) {
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
  if (message.content === `${PREFIX} baro`) {
    message.reply(await baroKiteerLocation());
  }

  /**
   * Nightwave
   */
  if (message.content === `${PREFIX} nightwave`) {
    message.reply({ embeds: [await nightwave()] });
  }

  /**
   * Void fissures
   */
  if (message.content === `${PREFIX} fissures`) {
    message.reply({ embeds: [await voidFissures()] });
  }
});

/**
 * World cycle loop
 */
startWorldCycleTrackingLoop(client);
  
client.login(<string>process.env.TOKEN);