
import {Router} from 'express';

import { SeedsController } from './controller';
import { SeedsDatasourceImpl } from '../../infrastructure/datasources/seeds.datasource.impl';
import { SeedsRepositoryImpl } from '../../infrastructure/repositories/seeds.repository.impl';

export class SeedsRoutes {

    static get routes():Router {

        const router = Router();

        const seedsDatasource = new SeedsDatasourceImpl();
        const seedsRepositoryImpl = new SeedsRepositoryImpl( seedsDatasource );
        const seedsController = new SeedsController( seedsRepositoryImpl );

        /**
         * @swagger
         * /api/seeds:
         *   get:
         *     summary: Create seeds
         *     description: Create application seeds
         *     operationId: createSeeds
         *     deprecated: true
         *     tags: 
         *       - Seeds
         *     responses:
         *       201:
         *         description: Successful response
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Seeds created successfully
         *                 status:
         *                   type: boolean
         *                   example: true
         */
        router.get('/', seedsController.create);

        return router;
    }

}
