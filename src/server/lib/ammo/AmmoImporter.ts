import { BallisticsCollection } from "../../interfaces/Ballistics"
import { Importer } from "../../interfaces/Importer"
import { Repository } from "../../interfaces/Repository"
import { AmmoKey } from "../../types/keys"
import { ammoTypes } from "../map/wiki/ammo"
import { AmmoRepository } from "./AmmoRepository"

export class AmmoImporter implements Importer<AmmoImporter>
{
    /**
     * Repository to access data storage
     */
    public repository: Repository<any> = new AmmoRepository

    /**
     * Import to JSON files
     * 
     * @param key the ammo type e.g. pistol, shotgun
     */
    async json(key?: unknown | null) {               
        if (!key) {
            const response: BallisticsCollection = []
            
            for (const ammoKey of Object.keys(ammoTypes)) {
                const data = await this.repository.storeToJsonFile(ammoKey)
                response.push(data)
            }

            console.log("importer", response)

            return response
        } else {
            return await this.repository.storeToJsonFile(<unknown>key as AmmoKey)
        }
    }
    
    /**
     * Import to Mongo
     * 
     * @param key 
     */
    async mongo(key?: unknown | null) {
        if (!key) {
            for (const ammo of Object.keys(ammoTypes)) {
                for (const ammoType of ammoTypes[<AmmoKey>ammo]) {
                    await this.repository.storeJsonFileToMongoDb(ammoType)
                }
            }
        } else {
            for (const ammoType of ammoTypes[<AmmoKey>key]) {
                await this.repository.storeJsonFileToMongoDb(ammoType)
            }
        }
        
        return this
    }
}