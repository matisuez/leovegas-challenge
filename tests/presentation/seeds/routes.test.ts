import express from 'express';
import request from 'supertest';

import { prisma } from '../../../src/data/postgres';
import { SeedsRoutes } from '../../../src/presentation/seeds/routes';


describe('SeedsRoutes', () => {
    let app: express.Application;
    
    beforeAll(async () => {
        app = express();
        app.use(express.json());
        app.use('/api/seeds', SeedsRoutes.routes);
        await prisma.$connect();
    });
    
    afterAll(async () => {
        await prisma.$disconnect();
    });
    
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });
    
    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    test('GET /api/seeds should create seeds and return 201', async () => {
        const {body} = await request(app)
            .get('/api/seeds')
            .expect(201);

        expect(body).toEqual({
            message: 'Seeds created successfully',
            status: true,
        });
    });
});
