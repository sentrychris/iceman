declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            DISCORD_PREFIX: string;
            DISCORD_TOKEN: string;
            WARFRAME_API: string;
            FOUNDING_WARLORD_USER_ID: string;
            GENERAL_WARFRAME_CHAT_CHANNEL: string;
            CLAN_ANNOUNCEMENTS_CHANNEL: string;
            WORLD_CYCLE_TRACKING_CHANNEL: string;
        }
    }
}

export {}
