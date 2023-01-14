import type { Request, Response } from 'express'
import type { Repository } from '../interfaces/Repository'
import type { ImportKey } from '../types/keys'
import type { AmmoKey } from '../types/keys'
import { AmmoRepository } from '../lib/ammo/AmmoRepository'
import { ammoTypes } from '../lib/map/wiki/ammo'


export default class ImportController
{
    protected repos: Record<string, Repository>  = {
        ammo: new AmmoRepository
    }
    
    async importToJson(req: Request , res: Response) {
        try {
            const key = <unknown>req.query.key as ImportKey

            if (key === 'ammo') {
                const ammo = <unknown>req.query.subKey as AmmoKey
                
                if (!ammo) {
                    for (const ammo of Object.keys(ammoTypes)) {
                        await this.repos[key].storeToJson(ammo)
                    }
                } else {
                    await this.repos[key].storeToJson(ammo)
                }
            }

            res.send(201)
        } catch (error) {
            console.log(error)
        }
    }

    async importToMongoDb(req: Request, res: Response) {
        try {
            const key = <unknown>req.query.key as ImportKey

            if (key === 'ammo') {
                const ammo = <unknown>req.query.subKey as AmmoKey

                if (!ammo) {
                    for (const ammo of Object.keys(ammoTypes)) {
                        for (const ammoType of ammoTypes[<AmmoKey>ammo]) {
                            await this.repos[key].storeJsonToMongoDb(ammoType)
                        }
                    }
                } else {
                    for (const ammoType of ammoTypes[ammo]) {
                        await this.repos[key].storeJsonToMongoDb(ammoType)
                    }
                }
            }

            res.send(201)
        } catch (error) {
            console.log(error)
        }
    }
}