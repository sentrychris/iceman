import * as dotenv from 'dotenv'
import { Client, Intents, Message, MessageEmbed } from 'discord.js'
import { TarkovTimer } from './tarkov/TarkovTimer'
import { command556x45 } from './commands/ammo/556x45'

dotenv.config()
const cmdPrefix: string = (process.env.PREFIX as string)

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

const timer = new TarkovTimer()
 
client.on('ready', () => console.log('ready'))
 
client.on('messageCreate', (message: Message) => {
    if (!message.content.startsWith(cmdPrefix) || message.author.bot) {
        return
    }

    // Tarkov time
    if (message.content === `${cmdPrefix}time`) {
        const left = timer.getTarkovTime(true)
        const right = timer.getTarkovTime(false)

        const embed = new MessageEmbed()
            .setColor(0x3498DB)
            .setTitle("Tarkov Time")
            .setDescription('Local Raid Times')
            .addField('Left', left, true)
            .addField('Right', right, true)
        
        message.channel.send({ embeds: [embed] })
    }


    // Ammo commands 
    command556x45(cmdPrefix, message)
})
 
client.login((process.env.TOKEN as string))