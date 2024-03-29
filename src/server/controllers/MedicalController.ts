import type { Request, Response } from 'express';
import { client } from '../database';
import { MongoCollectionKey } from '../../shared/enums/collections';

export default class MedicalController
{
  async index(req: Request, res: Response) {
    try {
      const collection = await client.getCollection(MongoCollectionKey.Medical);
      const result = await collection.aggregate().toArray();
      res.send(result);
    } catch (error) {
      res.send(error).status(400);
    }
  }

  async search(req: Request, res: Response) {
    try {
      const collection = await client.getCollection(MongoCollectionKey.Medical);

      let result;
      if (req.query.search && req.query.search === 'atlas') {
        result = await collection.aggregate([{
          $search: {
            index: 'default',
            text: {
              path: 'Name',
              query: req.query.name,
              fuzzy: {}
            }
          }
        }]).toArray();
      } else {
        result = await collection.find({
          'Name': new RegExp(<string>req.query.name, 'i')
        }).toArray();
      }

      res.send(result);
    } catch (error) {
      res.send(error).status(400);
    }
  }
}