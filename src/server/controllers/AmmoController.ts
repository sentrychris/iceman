import type { Request, Response } from 'express'
import { client } from '../database'

export default class AmmoController
{
    async index(req: Request, res: Response) {
        try {
            const collection = await client.getCollection('ammo')
            const result = await collection.aggregate().toArray()
            res.send(result)
        } catch (error) {
            console.log(error)
        }
    }

    async search(req: Request, res: Response) {
        try {
            const collection = await client.getCollection('ammo')
            const result = await collection.aggregate([{
                $search: {
                    index: 'default',
                    text: {
                        path: "Name",
                        query: req.query.name,
                        fuzzy: {}
                    }
                }
            }]).toArray()

            res.send(result)
        } catch (error) {
            console.log(error)
        }
    }
}