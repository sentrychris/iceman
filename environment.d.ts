declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production'
            PREFIX: string
            TOKEN: string
            WARFRAME_API: string
        }
    }
}

export {}
