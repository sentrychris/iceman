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

const WARFRAME_API = <string>process.env.WARFRAME_API ?? 'https://api.warframestat.us/pc';

const WARFRAME_MARKET_API = <string>process.env.WARFRAME_MARKET_API ?? 'https://api.warframe.market/v2';

const DISCORD_PREFIX = <string>process.env.DISCORD_PREFIX ?? '!wf';

const FOUNDING_WARLORD_USER_ID = <string>process.env.FOUNDING_WARLORD_USER_ID; // shikaricm
const GENERAL_WARFRAME_CHAT_CHANNEL = <string>process.env.GENERAL_WARFRAME_CHAT_CHANNEL; // #general-warframe-chat
const CLAN_ANNOUNCEMENTS_CHANNEL = <string>process.env.CLAN_ANNOUNCEMENTS_CHANNEL;       // #nihil-vox-announcements
const WORLD_CYCLE_TRACKING_CHANNEL  = <string>process.env.WORLD_CYCLE_TRACKING_CHANNEL;  // #world-cycle-tracking
const WORLD_CYCLE_UPDATE_INTERVAL_MS = 60 * 60 * 1000;

export {
  client,
  WARFRAME_API,
  WARFRAME_MARKET_API,
  DISCORD_PREFIX,
  FOUNDING_WARLORD_USER_ID,
  GENERAL_WARFRAME_CHAT_CHANNEL,
  CLAN_ANNOUNCEMENTS_CHANNEL,
  WORLD_CYCLE_TRACKING_CHANNEL,
  WORLD_CYCLE_UPDATE_INTERVAL_MS
};
 