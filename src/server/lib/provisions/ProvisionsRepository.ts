import type { Provisions } from '../../../shared/interfaces/resource/Provisions';
import type { ProvisionsCollection } from '../../../shared/types/collections';
import type { ProvisionsKey } from '../../../shared/types/keys';
import { ProvisionsParser } from './ProvisionsParser';
import { provisionsTypes } from '../../map/wiki/provisions';
import { client } from '../../database';
import { MongoCollectionKey } from '../../../shared/enums/collections';
import { BaseRepository } from '../BaseRepository';

export class ProvisionsRepository extends BaseRepository<ProvisionsParser, ProvisionsKey, Provisions, ProvisionsCollection>
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
  async storeToJsonFile(key: ProvisionsKey) {
    return this.store('json', {
      key,
      types: provisionsTypes,
      parser: new ProvisionsParser
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
  async storeJsonFileToMongoDb(key: string, type: string) {
    try {
      const data = await this.readJsonFile(key, type);
      const collection = await client.getCollection(MongoCollectionKey.Provision);
      const response = await collection.insertMany(data);
      
      return response;
    } catch (error) {
      console.log(error);
    }
    
    return [];
  }
}