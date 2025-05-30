import { Message, EmbedBuilder } from 'discord.js';
import { client, PREFIX, WARFRAME_API } from './config';
import { cetus, cambionDrift, orbVallis } from './commands/world-cycles';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    return;
  }

  if (message.content === `${PREFIX} version`) {
    const data = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle('Cephalon Vox')
      .setDescription('Nihil Vox Discord bot for Warframe Players.')
      .addFields({ name: 'Version', value: '1.0', inline: true });
      
    message.reply({ embeds: [data] });
  }

  console.log({message});
    
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

  if (message.content === `${PREFIX} baro`) {
    try {
      const res = await fetch(`${WARFRAME_API}/voidTrader`);
      const data = await res.json();

      if (data.active) {
        message.reply(`**Baro Ki'Teer** is currently at the **${data.location}** and will leave in **${data.endString}**.`);
      } else {
        message.reply(`**Baro Ki'Teer** will arrive at the **${data.location}** in **${data.startString}**.`);
      }
    } catch (err) {
      console.error(err);
      message.reply('Unable to fetch Baro Ki\'Teer info right now.');
    }
  }
});

  
client.login(<string>process.env.TOKEN);