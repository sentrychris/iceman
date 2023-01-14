import type { Router } from 'express-serve-static-core'
import ImportController from '../controllers/ImportController'

const controller = new ImportController

export const useImportRoutes = (router: Router) => {
    router.get('/import/json', controller.importToJson.bind(controller))
    router.get('/import/mongo', controller.importToMongoDb.bind(controller))
}