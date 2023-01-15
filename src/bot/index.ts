import { Message } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { prefix, channels, client, mongo } from './bootstrap'
import { getRaidTimes } from './local/RaidTimer'
import { getBallisticsData } from './local/AmmoBallistics'


client.on('ready', () => {
    console.log('ready')

    // Tarkov raid time loop, posts to #raid-timer every 5 minutes
    setInterval(async () => {
        const channel = <TextChannel>await client.channels.fetch(channels.raidTimer)

        channel.send({ embeds: [getRaidTimes({
            embed: true
        })] })
    }, 300000)
})
 
client.on('messageCreate', async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return
    }

    // Tarkov raid time (!time)
    if (message.content === `${prefix}time`) {
        message.channel.send({ embeds: [getRaidTimes({
            embed: true
        })] })
    }

    // Tarkov raid time (!time)
    if (message.content.startsWith(`${prefix}ammo`)) {
        const key = message.content.substring(message.content.indexOf(`${prefix}ammo`))
        console.log(key)
        message.channel.send({ embeds: [await getBallisticsData(key, {
            embed: true
        })] })
    }
})
 
client.login((process.env.TOKEN as string))