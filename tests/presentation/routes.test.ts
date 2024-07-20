import fs from 'fs';
import path from 'path';
import request from 'supertest';
import {testServer} from '../test-server';

describe.only('[ROUTES] routes.ts', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
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

    test('Should return 200 from Swagger /api/docs', async() => {
        const response = await request(testServer.app)
            .get('/api/docs')
            .expect(301);

        await request(testServer.app)
            .get(response.headers.location)
            .expect(200);
    });

    test('Should return 404 from unknown routes and serve notFound.html', async() => {
        const res = await request(testServer.app)
            .get('/api/non-existing-route')
            .expect(404);

        const notFoundPath = path.join(__dirname, '../../public/notFound.html');
        const notFoundFileContent = fs.readFileSync(notFoundPath, 'utf8');
        
        expect(res.text).toBe(notFoundFileContent);
    });

    test('Should ensure notFound.html exists and is readable', async() => {
        await request(testServer.app)
            .post('/api/non-existing-route')
            .expect(404);

        const notFoundPath = path.join(__dirname, '../../public/notFound.html');
        expect(fs.existsSync(notFoundPath)).toBe(true);
        expect(() => fs.readFileSync(notFoundPath, 'utf8')).not.toThrow();
    });

});