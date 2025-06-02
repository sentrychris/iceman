import { EmbedBuilder, type Message } from "discord.js";
import { DISCORD_PREFIX, DISCORD_COLOR, CLAN_ICON } from "./config";

export const usage = async (message: Message) => {
  if (
    message.content === `${DISCORD_PREFIX}`
    || message.content === `${DISCORD_PREFIX} help`
    || message.content === `${DISCORD_PREFIX} usage`
    || message.content === `${DISCORD_PREFIX} info`
    || message.content === `${DISCORD_PREFIX} ?`
  ) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(DISCORD_COLOR.blue)
          .setTitle('Warframe Bot Usage')
          .setDescription(`Use the following commands with \`${DISCORD_PREFIX.trim()}\``)
          .addFields(
            {
              name: '`!wf world`',
              value: 'Shows current world cycles for Cetus, Cambion Drift, and Orb Vallis.\nOptional filter: `!wf world cetus`\n-\n',
              inline: false
            },
            {
              name: '`!wf baro`',
              value: 'Displays Baro Ki\'Teer\'s current location and arrival/departure times.\n-\n',
              inline: false
            },
            {
              name: '`!wf teshin`',
              value: 'Displays the current Steel Path Honors rotation from Teshin.\n-\n',
              inline: false
            },
            {
              name: '`!wf sortie`',
              value: 'Displays today\'s Sortie missions, boss, faction, and modifiers.\n-\n',
              inline: false
            },
            {
              name: '`!wf archon`',
              value: 'Displays this week\'s Archon Hunt mission.\n-\n',
              inline: false
            },
            {
              name: '`!wf nightwave`',
              value: 'Shows current Nightwave acts (daily and weekly).\n-\n',
              inline: false
            },
            {
              name: '`!wf fissures`',
              value: 'Lists currently active Void Fissures grouped by relic era.\nOptional filter: `!wf fissures meso`\n-\n',
              inline: false
            },
            {
              name: '`!wf relics <item name>`',
              value: 'Finds all Void Relics that drop a specific item.\nExample: `!wf relics trinity prime systems`\n-\n',
              inline: false
            },
            {
              name: '`!wf buy <item name>` or `!wf wtb <item name>`',
              value: 'Gets the cheapest in-game sell order for a Warframe Market item.\nExample: `!wf buy frost prime set`\n-\n',
              inline: false
            }
          )
          .setFooter({ text: 'Only in-game sellers are shown in market lookups.' })
          .setThumbnail(CLAN_ICON)
      ]
    });
  }
};
