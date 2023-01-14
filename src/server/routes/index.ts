import express, { type Response } from 'express';
import { useAmmoRoutes } from './ammo';

/**
 * setup router
 */
const router = express.Router()

/**
 * Register routes
 */
useAmmoRoutes(router)

/**
 * catch all route
 */
router.get(/.*/, (_, res: Response) => res.sendStatus(200))


export default router