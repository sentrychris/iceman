import { mongo  } from '../bootstrap'
import { MessageEmbed } from 'discord.js'
import { Ballistics } from '../../server/interfaces/Ballistics'

export class AmmoBallistics
{
    async getDataForAmmo(ammo: string) {
        console.log(ammo)
        const collection = await mongo.getCollection('ammo')
        const result = await collection.aggregate([{
            $search: {
                index: 'default',
                text: {
                    path: "Name",
                    query: ammo,
                    fuzzy: {}
                }
            }
        }]).toArray()

        return result[0]
    }
}

export async function getBallisticsData(ammo: string, {embed}: {embed: boolean}): Promise<any>
{
    const ballistics = new AmmoBallistics
    const data = <unknown>await ballistics.getDataForAmmo(ammo) as Ballistics

    if (embed) {
        return new MessageEmbed()
            .setColor(0x3498DB)
            .setTitle("-- dev testing pls ignore --")
            .setDescription('Ballistics Info')
            .addField('Name', data.Name ?? '--', true)
            .addField('Damage', data.Damage ?? "--", true)
            .addField('Armor Damage', data['Armor Damage %'] ?? "--", true)
            .addField('Penetration', data['Penetration Power'] ?? "--", true)
            .addField('Accuracy', data['Accuracy %'] ?? "--", true)
            .addField('Recoil', data['Recoil'] ?? "--", true)
            .addField('Fragmentation Chance', data['Fragmentation Chance'] ?? "--", true)
            .addField('Light Bleed %', data['Light Bleeding Chance %'] ?? "--", true)
            .addField('Heavy Bleed %', data['Heavy Bleeding Chance %'] ?? "--", true)
            .addField('Speed (m/s)', data['Projectile Speed (m/s)'] ?? "--", true)
            .addField('Obtainable by', data['Obtainable by'] ?? "--", true)
    }

    return data
}