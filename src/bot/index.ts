import { Message } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { prefix, channels, client, mongo } from './bootstrap'
import { getRaidTimes } from './local/RaidTimer'


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
 
client.on('messageCreate', (message: Message) => {
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
    if (message.content.startsWith(`${prefix}5.45x39`)) {
        mongo.getCollection('ammo').then(async (collection) => {
            const matches = collection.find({
                'Name': {
                    $regex: message.content.substring(message.content.indexOf(prefix))
                }
            })

            console.log(matches)
        })
    }
})
 
client.login((process.env.TOKEN as string))