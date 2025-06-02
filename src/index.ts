import { EmbedBuilder, type Message, type TextChannel } from 'discord.js';
import { getBaroKiteerLocation } from './commands/baro-kiteer';
import { buildNightwaveEmbed } from './commands/nightwave-alerts';
import { buildVoidFissuresEmbed } from './commands/void-fissures';
import { buildWorldCyclesEmbed } from './commands/world-cycles';
import { buildSortieEmbed } from './commands/sortie-mission';
import { buildArchonHuntEmbed } from './commands/archon-hunt';
import { buildClanPrizeDrawEmbed } from './commands/clan-prizedraw';
import { buildTeshinRotationEmbed } from './commands/teshin-rotation';
import { buildMarketPriceEmbed, getWarframeMarketCheapestSellOrder } from './commands/waframe-market';
import { client, DISCORD_PREFIX, CLAN_ICON, CLAN_ANNOUNCEMENTS_CHANNEL, FOUNDING_WARLORD_USER_ID, DISCORD_COLOR } from './config';
  
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
  if (
    message.content === `${DISCORD_PREFIX}` ||
    message.content === `${DISCORD_PREFIX} help` ||
    message.content === `${DISCORD_PREFIX} usage`
  ) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(DISCORD_COLOR.blue)
          .setTitle('Warframe Bot Usage')
          .setDescription('Use the following commands with `!wf`')
          .addFields(
            { name: '`!wf world` or `!wf wc`', value: 'Shows current world cycles for Cetus, Cambion Drift, and Orb Vallis.', inline: false },
            { name: '`!wf baro` or `!wf vt`', value: 'Displays Baro Ki\'Teer\'s current location and arrival/departure times.', inline: false },
            { name: '`!wf teshin` or `!wf sp`', value: 'Displays the current Steel Path Honors rotation from Teshin.', inline: false },
            { name: '`!wf sortie`', value: 'Displays today\'s Sortie missions, boss, faction, and modifiers.', inline: false },
            { name: '`!wf archon`', value: 'Displays this week\'s Archon Hunt mission.', inline: false },
            { name: '`!wf nightwave` or `!wf nw`', value: 'Shows current Nightwave acts (daily and weekly).', inline: false },
            {
              name: '`!wf fissures` or `!wf vf`',
              value: 'Lists currently active Void Fissures grouped by relic era. Optional filter: `!wf fissures meso`.',
              inline: false
            },
            {
              name: '`!wf buy <item name>` or `!wf wtb <item name>`',
              value: 'Gets the cheapest in-game sell order for a Warframe Market item.\nExample: `!wf buy frost prime set`',
              inline: false
            }
          )
          .setFooter({ text: 'Only in-game sellers are shown in market lookups.' })
          .setThumbnail(CLAN_ICON)
      ]
    });
  }


  /**
   * Baro Ki'Teer void trader location
   */
  if (message.content === `${DISCORD_PREFIX} baro` || message.content === `${DISCORD_PREFIX} vt`) {
    message.reply({ embeds: [await getBaroKiteerLocation()]});
  }

  /**
   * Nightwave daily & weekly alerts
   */
  if (message.content === `${DISCORD_PREFIX} nightwave` || message.content === `${DISCORD_PREFIX} nw`) {
    message.reply({ embeds: [await buildNightwaveEmbed()] });
  }

  /**
   * Active void fissures
   */
  if (message.content.startsWith(`${DISCORD_PREFIX} fissures`) || message.content.startsWith(`${DISCORD_PREFIX} vf`)) {
    const parts = message.content.trim().split(/\s+/);
    const tierFilter = parts.length > 2 ? parts.slice(2).join(' ') : parts[1]; // support '!wf fissures meso' or '!wf vf meso'

    const knownTiers = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'];
    const isTier = tierFilter && knownTiers.some(t => t.toLowerCase() === tierFilter.toLowerCase());

    const embed = await buildVoidFissuresEmbed(isTier ? tierFilter : undefined);
    message.reply({ embeds: [embed] });
  }

  /**
   * World cycle timers
   */
  if (message.content === `${DISCORD_PREFIX} world` || message.content === `${DISCORD_PREFIX} wc`) {
    message.reply({ embeds: await buildWorldCyclesEmbed() });
  }

  /**
   * Sortie missions
   */
  if (message.content === `${DISCORD_PREFIX} sortie`) {
    return message.reply({ embeds: [await buildSortieEmbed()] });
  }

  /**
   * Archon hunts
   */
  if (message.content === `${DISCORD_PREFIX} archon`) {
    message.reply({ embeds: [await buildArchonHuntEmbed()] });
  }

  /**
   * Steel Path Honors shop (Teshin rotation)
   */
  if (message.content === `${DISCORD_PREFIX} teshin` || message.content === `${DISCORD_PREFIX} sp`) {
    return message.reply({ embeds: [buildTeshinRotationEmbed()] });
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
      embeds: [await buildClanPrizeDrawEmbed()],
    });
  }

  /**
   * Warframe market cheapest sell order
   */
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
});
  
client.login(<string>process.env.DISCORD_AUTH_TOKEN);