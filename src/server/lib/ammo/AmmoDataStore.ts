import * as fs from 'fs'
import { ammoParser } from './AmmoParser'
import { rifleAmmo } from '../map/wikiAmmo'
import { client } from '../../database'

class AmmoDataStore
{
    protected path: string  = `${__dirname}/../../storage`

    async storeFetchedAmmoToJson() {
        for (const ammoType of rifleAmmo) {
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

    async storeJsonAmmoToMongoDb(ammoType: string) {
        try {
            if (ammoType) {
                const data = fs.readFileSync(`${this.path}/ammo/${ammoType}.json`, {
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