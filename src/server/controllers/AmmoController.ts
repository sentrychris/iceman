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
            const result = await collection.find({
                'Name': {
                    $regex: req.query.name
                }
            }).toArray()

            if (!result || result.length === 0) {
                res.send(`Nothing found for ${req.query.type}`).status(404)
            }

            res.send(result)
        } catch (error) {
            console.log(error)
        }
    }
}