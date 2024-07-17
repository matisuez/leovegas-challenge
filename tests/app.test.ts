import { envs } from '../src/config/envs';
import { Server } from '../src/presentation/server';


jest.mock('../src/presentation/server');

describe('Testing app.ts', () => {

    test('Should call server with arguments and start', async() => {

        await import ('../src/app');

        expect(Server).toHaveBeenCalledTimes(1);
        expect(Server).toHaveBeenCalledWith({
            port: envs.PORT,
            env: envs.NODE_ENV,
            routes: expect.any(Function),
            publicFolder: envs.PUBLIC_FOLDER,
        })

        expect(Server.prototype.start).toHaveBeenCalled();
    });

});

