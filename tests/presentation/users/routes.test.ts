import request from 'supertest';
import {testServer} from '../../test-server';

describe('[ROUTES] /api/users', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(async() => {
        await testServer.close();
    });

    test('Should get a valid personal user info', async() => {

        const { body } = await request( testServer.app )
                .get('/api/users/me')   
                .expect(200);

        expect( body ).toEqual({ message: 'User info got' });

    });

    test('Should login a valid user', async() => {

        const { body } = await request( testServer.app )
                .put('/api/users/me')   
                .expect(200);

            expect( body ).toEqual({ message: 'User info updated' });

    });

});