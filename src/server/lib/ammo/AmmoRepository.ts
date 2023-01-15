import type { Repository } from '../../interfaces/Repository'
import type { Ballistics, BallisticsCollection } from '../../interfaces/Ballistics'
import type { AmmoKey } from '../../types/keys'
import { ammoParser } from './AmmoParser'
import { ammoTypes } from '../map/wiki/ammo'
import { client } from '../../database'
import * as fs from 'fs'

export class AmmoRepository implements Repository<BallisticsCollection>
{
    public path: string  = `C:\\Users\\chris\\workspace\\tarkov-thingy\\storage`

    public collection: Array<BallisticsCollection> = []
    
    async storeToJsonFile(key: AmmoKey) {
        this.collection = []

        for (const ammoType of ammoTypes[key]) {
            const ammo = await ammoParser.getData(ammoType)
            const ballistics = await ammo.parseData()

            if (ballistics && ballistics instanceof Array<Ballistics>) {
                await this.writeJsonFile(ammoType, ballistics)
                this.collection.push(ballistics)
            }
        }

        return this.collection
    }

    async storeJsonFileToMongoDb(key: string | null = null) {
        try {
            if (key) {
                const data = await this.readJsonFile(key)
                const collection = await client.getCollection('ammo')
                await collection.insertMany(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    private async writeJsonFile(key: string, data: Array<Ballistics>) {
        fs.writeFileSync(`${this.path}/ammo/${key}.json`,
            JSON.stringify(data, null, 4),
            {
                encoding: 'utf-8'
            }
        )

        return this
    }

    private async readJsonFile(key: string) {
        const data = fs.readFileSync(`${this.path}/ammo/${key}.json`, {
            encoding: 'utf-8',
        })

        return JSON.parse(data)
    }
}