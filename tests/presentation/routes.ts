import request from 'supertest';
import {testServer} from '../test-server';

describe('[ROUTES] routes.ts', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(async() => {
        await testServer.close();
    });

    test('Should return PONG from /api/ping', async() => {
        const { body } = await request( testServer.app )
            .get('/api/ping')
            .expect(200);
        expect( body ).toEqual({
            message: `Pong`,
            status: `Success`,
        });
    });

    test('Should return 404 from unknow routes', async() => {
        await request( testServer.app )
            .get('/api/pinasdasdasg')
            .expect(404);
    });

    test('Should return 200 from /api/docs', async() => {
        const response = await request(testServer.app)
            .get('/api/docs')
            .expect(301);

        await request(testServer.app)
            .get(response.headers.location)
            .expect(200);
    });

});