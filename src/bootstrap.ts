import { config } from 'dotenv'
import { Client, Intents } from 'discord.js'

config()

const prefix = <string>process.env.PREFIX

const channels = {
    botShit: <string>process.env.BOT_SHIT,
    raidTimer: <string>process.env.RAID_TIMER
}

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

export {
    prefix,
    channels,
    client
}
 