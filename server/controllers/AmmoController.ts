import type { Request, Response } from 'express'
import { mongo } from '../database'

export default class AmmoController
{
    async index(req: Request, res: Response) {
        try {
            const data = await mongo.getCollection('ammo')
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    }


    async show(req: Request, res: Response) {
        try {
            const ammo = await mongo.getCollection('ammo')
            ammo.findOne({
                'name': {
                    $regex: req.query.name
                }
            })

            if (!ammo) {
                res.send(404)
            } else {
                res.send(ammo)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    async store(req: Request, res: Response) {}
}