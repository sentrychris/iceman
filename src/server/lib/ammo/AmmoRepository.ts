import type { Repository } from '../../interfaces/Repository'
import type { AmmoKey } from '../../types/keys'
import { mappedAmmo } from '../map/wikiAmmo'
import { ammoParser } from './AmmoParser'
import { client } from '../../database'
import * as fs from 'fs'

export class AmmoRepository implements Repository
{
    public path: string  = `${__dirname}/../../storage`

    async storeToJson(key: AmmoKey) {
        for (const ammoType of mappedAmmo[key]) {
            ammoParser.getData(ammoType).then(async (ammo) => {
                const data = await ammo.parseData()
                if (data) {
                    fs.writeFileSync(`${this.path}/ammo/${ammoType}.json`, JSON.stringify(data, null, 4), {
                        encoding: 'utf-8'
                    })
                }
            })
        }
    }

    async storeJsonToMongoDb(key: string | null = null) {
        try {
            if (key) {
                const data = fs.readFileSync(`${this.path}/ammo/${key}.json`, {
                    encoding: 'utf-8',
                })

                const collection = await client.getCollection('ammo')                
                await collection.insertMany(JSON.parse(data))
            }
        } catch (error) {
            console.log(error)
        }
    }
}