import request from 'supertest';
import {testServer} from '../../test-server';

describe('[ROUTES] /api/auth', () => {

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
            .post('/api/auth/register')   
            .send( firstUser )
            .expect(201);

        expect( body ).toEqual({ message: 'User registered' });

    });

    test('Should login a valid user', async() => {

        const { body } = await request( testServer.app )
            .post('/api/auth')   
            .send( firstUser )
            .expect(200);

        expect( body ).toEqual({ message: 'User logged' });

    });

});