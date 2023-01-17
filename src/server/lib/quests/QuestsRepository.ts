import type { Quest } from '../../interfaces/dao/Quest';
import type { QuestsCollection } from '../../types/collections';
import type { QuestsKey } from '../../types/keys';
import { questsParser } from './QuestsParser';
import { questsTypes } from '../../map/wiki/quests';
import { client } from '../../database';
import { BaseRepository } from '../BaseRepository';

export class QuestsRepository extends BaseRepository<QuestsKey, Quest, QuestsCollection>
{  
    /**
     * Store data to JSON file.
     * 
     * This method uses the parser to fetch data from the tarkov wiki
     * and return it in a JSON array for writing to files at the
     * designated storage path.
     * 
     * @param key 
     * @returns 
     */
    async storeToJsonFile(key: QuestsKey) {
      return this.store('json', {
        key,
        types: questsTypes,
        parser: questsParser
      });
    }

    /**
     * Store JSON file data to MongoDB.
     * 
     * This method is quite straight-forward, it just passes
     * the JSON file to insertMany to upload the JSON to the
     * designated collection.
     * 
     * @param key
     * @returns 
     */
    async storeJsonFileToMongoDb(key: string | null = null) {
        try {
            if (key) {
                const data = await this.readJsonFile(key);
                const collection = await client.getCollection('quests');
                const response = await collection.insertMany(data);

                return response;
            }
        } catch (error) {
            console.log(error);
        }

        return [];
    }
}