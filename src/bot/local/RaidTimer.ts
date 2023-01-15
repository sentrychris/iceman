import {formatTime, hours} from '../../utilities'
import { MessageEmbed } from 'discord.js'

export class RaidTimer
{
    private multiplier: number = 7

    realTimeToTarkovTime(time: Date, left: boolean): Date {
        const offset = hours(3) + (left ? 0 : hours(12)) // 3 = St Petersburg offset
        const tarkovTime = new Date((offset + (time.getTime() * this.multiplier)) % hours(24))
    
        return tarkovTime
    }

    getTarkovTime(local: boolean) {
        return formatTime(this.realTimeToTarkovTime(new Date(), local))
    }
}

export function getRaidTimes({embed}: {embed: boolean}): MessageEmbed | Record<string, string>
{
    const timer = new RaidTimer
    const left = timer.getTarkovTime(true)
    const right = timer.getTarkovTime(false)

    if (embed) {
        return new MessageEmbed()
            .setColor(0x3498DB)
            .setTitle("Tarkov Time")
            .setDescription('Local Raid Times')
            .addField('Left', left, true)
            .addField('Right', right, true)
    }

    return {
        left, right
    }
}