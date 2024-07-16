
import {envs} from '../../src/config/envs';

describe('Environments Variables', () => {
    test('Should return envs', () => {
        expect( envs ).toEqual({
            PORT: 3001,
            NODE_ENV: 'test',
        });
    });
    test('', async() => {
        jest.resetModules();
        process.env.PORT = 'ABC';
        try {
            await import('../../src/config/envs');
            expect(true).toBe(false);
        } catch (error) {
            expect(`${ error }`).toContain(`"PORT" should be a valid integer`);
        }
    });
});
