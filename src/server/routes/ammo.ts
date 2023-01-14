import type { Router } from 'express-serve-static-core'
import AmmoController from '../controllers/AmmoController'

const controller = new AmmoController

export const useAmmoRoutes = (router: Router) => {
    router.get('/ammo', controller.index);
    router.get('/ammo/:slug', controller.show);
    router.post('/ammo/:slug', controller.store);
}