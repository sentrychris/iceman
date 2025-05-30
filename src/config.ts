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

const GENERAL_WARFRAME_CHAT_CHANNEL = "1356609283609067653"; // #general-warframe-chat
const WORLD_CYCLE_TRACKING_CHANNEL  = "1378043397188751452"; // #world-cycle-tracking
const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export {
  client,
  PREFIX,
  WARFRAME_API,
  GENERAL_WARFRAME_CHAT_CHANNEL,
  WORLD_CYCLE_TRACKING_CHANNEL,
  INTERVAL_MS
};
 