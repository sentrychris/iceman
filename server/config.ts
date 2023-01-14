import { config } from 'dotenv'
import type { ConfigInterface } from './interfaces/ConfigInterface'

config()

export const settings: ConfigInterface = {
    app: {
        url: process.env.APP_URL ?? '',
        port: process.env.PORT ?? 3000,
        secret: process.env.APP_SECRET ?? ''
    },
    mongo: {
        cluster: process.env.MONGO_CLUSTER ?? '',
        user: process.env.MONGO_USER ?? '',
        password: process.env.MONGO_PASSWORD ?? '',
        database: process.env.MONGO_DATABASE ?? ''
    },
}