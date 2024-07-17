import request from 'supertest';
import {testServer} from '../../test-server';

describe('[ROUTES] /api/admin', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(async() => {
        await testServer.close();
    });

    const firstUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        role: "USER",
        access_token: "...",
    }

    test('Should register a valid user', async() => {

        const { body } = await request( testServer.app )
            .get(`/api/admin/users`)   
            .expect(200);

        expect( body ).toEqual({ message: 'Users got' });

    });

    test('Should login a valid user', async() => {

        const userId = 1;

        const { body } = await request( testServer.app )
            .put(`/api/admin/users/${ userId }`)   
            .expect(200);

        expect( body ).toEqual({ message: 'User updated' });

    });

    test('Should login a valid user', async() => {

        const userId = 1;
        const { body } = await request( testServer.app )
            .delete(`/api/admin/users/${ userId }`)   
            .expect(200);

        expect( body ).toEqual({ message: 'User deleted' });

    });

});