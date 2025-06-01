declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            WARFRAME_API: string;
            WARFRAME_MARKET_API: string;
            CLAN_ICON: string;
            DISCORD_PREFIX: string;
            DISCORD_AUTH_TOKEN: string;
            FOUNDING_WARLORD_USER_ID: string;
            GENERAL_WARFRAME_CHAT_CHANNEL: string;
            CLAN_ANNOUNCEMENTS_CHANNEL: string;
            WORLD_CYCLE_TRACKING_CHANNEL: string;
        }
    }
}

export {}
