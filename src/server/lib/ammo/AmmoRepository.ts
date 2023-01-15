import type { Repository } from '../../interfaces/Repository'
import type { Ballistics } from '../../interfaces/Ballistics'
import type { BallisticsCollection } from '../../types/collections'
import type { AmmoKey } from '../../types/keys'
import { ammoParser } from './AmmoParser'
import { ammoTypes } from '../map/wiki/ammo'
import { settings } from '../../config'
import { client } from '../../database'
import * as fs from 'fs'

export class AmmoRepository implements Repository<BallisticsCollection>
{
    /**
     * Storage path
     */
    public path: string = settings.app.storage

    /**
     * Collected data
     */
    public collection: Array<BallisticsCollection> = []
    
    /**
     * Store data to JSON file
     * 
     * @param key 
     * @returns 
     */
    async storeToJsonFile(key: AmmoKey) {
        console.log(this.path)
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

    /**
     * Store JSON file data to Mongo DB
     * 
     * @param key
     * @returns 
     */
    async storeJsonFileToMongoDb(key: string | null = null) {
        try {
            if (key) {
                const data = await this.readJsonFile(key)
                const collection = await client.getCollection('_ammo')
                const response = await collection.insertMany(data)

                console.log(response)

                return response
            }
        } catch (error) {
            console.log(error)
        }

        return []
    }

    /**
     * Clear collected data
     */
    async clearCollection() {
        this.collection = []
    }

    /**
     * Write JSON file
     * 
     * @param key 
     * @param data 
     * @returns 
     */
    private async writeJsonFile(key: string, data: Array<Ballistics>) {
        fs.writeFileSync(`${this.path}/ammo/${key}.json`,
            JSON.stringify(data, null, 4),
            {
                encoding: 'utf-8'
            }
        )

        return this
    }

    /**
     * Read JSON file
     * 
     * @param key
     * @returns 
     */
    private async readJsonFile(key: string) {
        const data = fs.readFileSync(`${this.path}/ammo/${key}.json`, {
            encoding: 'utf-8',
        })

        return JSON.parse(data)
    }
}