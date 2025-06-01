import { EmbedBuilder, type Message, type TextChannel } from 'discord.js';
import { getBaroKiteerLocation } from './commands/baro-kiteer';
import { buildNightwaveEmbed } from './commands/nightwave';
import { buildVoidFissuresEmbed } from './commands/void-fissures';
import { buildWorldCyclesEmbed } from './commands/world-cycles';
import { buildClanPrizeDrawEmbed } from './commands/clan-prizedraw';
import { buildMarketPriceEmbed, getWarframeMarketCheapestSellOrder } from './commands/waframe-market';
import { client, FOUNDING_WARLORD_USER_ID, DISCORD_PREFIX, CLAN_ANNOUNCEMENTS_CHANNEL } from './config';
  
client.on('ready', () => {
  console.log('ready');
});
  
client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(DISCORD_PREFIX) || message.author.bot) {
    return;
  }

  /**
   * Help / usage
   */
  if (message.content === `${DISCORD_PREFIX}` || message.content === `${DISCORD_PREFIX} help` || message.content === `${DISCORD_PREFIX} usage`) {
    return message.reply({ embeds: [new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle('Warframe Bot Usage')
      .setDescription('Use the following commands with `!wf`')
      .addFields(
        { name: '`!wf world` or `!wf cycles`', value: 'Shows current world cycles for Cetus, Cambion Drift, and Orb Vallis.', inline: false },
        { name: '`!wf baro`', value: 'Displays Baro Ki\'Teer\'s current location and arrival/departure times.', inline: false },
        { name: '`!wf nightwave`', value: 'Shows current Nightwave acts (daily and weekly).', inline: false },
        { name: '`!wf fissures`', value: 'Lists currently active Void Fissures.', inline: false },
        { name: '`!wf buy <item name>`', value: 'Gets the cheapest in-game sell order for a Warframe Market item. Example: `!wf buy frost prime set`', inline: false },
      )
      .setFooter({ text: 'Only in-game sellers are shown in market lookups.' })
      .setThumbnail('https://i.imgur.com/fQn9zNL.png')]
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
   * World cycle timers
   */
  if (message.content === `${DISCORD_PREFIX} world` || message.content === `${DISCORD_PREFIX} cycles`) {
    message.reply({ embeds: await buildWorldCyclesEmbed() });
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
    const query = message.content.slice(`${DISCORD_PREFIX} buy `.length).trim();
    const slug = query.toLowerCase().replace(/\s+/g, '_');
    const displayName = query.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const order = await getWarframeMarketCheapestSellOrder(slug);

    if (!order) {
      return message.reply(`No active sell orders found for **${displayName}**.`);
    }

    return message.reply({ embeds: [buildMarketPriceEmbed(displayName, slug, order)] });
  }
});
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);