import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = <string>process.env.PREFIX ?? '!';
const WARFRAME_API = <string>process.env.WARFRAME_API ?? 'https://api.warframestat.us/pc';

export {
  client,
  PREFIX,
  WARFRAME_API
};
 