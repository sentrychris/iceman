import { Importer } from "../../interfaces/Importer"
import { Repository } from "../../interfaces/Repository"
import { AmmoKey } from "../../types/keys"
import { AmmoRepository } from "./AmmoRepository"
import { ammoTypes } from "../map/wiki/ammo"

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
        this.repository.clearCollection()

        if (!key) {           
            for (const ammoKey of Object.keys(ammoTypes)) {
                await this.repository.storeToJsonFile(ammoKey)
            }

            return this.repository.collection
        } else {
            return await this.repository.storeToJsonFile(<AmmoKey>key)
        }
    }
    
    /**
     * Import to Mongo
     * 
     * @param key 
     */
    async mongo(key?: unknown | null) {
        this.repository.clearCollection()

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