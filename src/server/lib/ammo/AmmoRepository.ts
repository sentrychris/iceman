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

    public collection: BallisticsCollection = []

    async storeToJsonFile(key: AmmoKey) {
        for (const ammoType of ammoTypes[key]) {
            ammoParser.getData(ammoType).then(async (ammo) => {
                const data = await ammo.parseData()

                if (data && data instanceof Array<Ballistics>) {
                    fs.writeFileSync(`${this.path}/ammo/${ammoType}.json`, JSON.stringify(data, null, 4), {
                        encoding: 'utf-8'
                    })
                    
                    this.collection.push(data)
                }
            })
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

    protected async readJsonFile(key: string) {
        const data = fs.readFileSync(`${this.path}/ammo/${key}.json`, {
            encoding: 'utf-8',
        })

        return JSON.parse(data)
    }
}