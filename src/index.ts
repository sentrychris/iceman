import { Message } from 'discord.js';
import { client, PREFIX } from './config';
import { cetus, cambionDrift, orbVallis } from './commands/world-cycles';
import { baroKiteerLocation } from './commands/baro-kiteer';
  
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
});

  
client.login(<string>process.env.TOKEN);