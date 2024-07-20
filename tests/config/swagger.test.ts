import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import {Swagger} from '../../src/config/swagger';

jest.mock('swagger-jsdoc');
jest.mock('swagger-ui-express', () => ({
    setup: jest.fn(),
    serve: jest.fn(),
}));

describe('Swagger config', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return setup as a RequestHandler', () => {
        const port = 3000;
        const setupResult = Swagger.setup(port);
        expect(setupResult).toBe(swaggerUi.setup(swaggerJSDoc({})));
    });

    test('Should return serve from swaggerUi', () => {
        expect(Swagger.serve).toBe(swaggerUi.serve);
    });

    test('Should call swaggerJSDoc with correct options', () => {
        const port = 3000;
        Swagger.setup(port);
        
        const expectedOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'API Documentation',
                    version: '1.0.0',
                    description: 'LeoVegas Challenge API Information',
                    contact: {
                        name: 'Matias',
                        surname: 'Suez',
                        email: 'matisuez@gmail.com',
                    },
                    servers: [`http://localhost:${port}/api`],
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                    schemas: expect.any(Object),
                },
            },
            apis: ['**/*.ts'],
        };
        
        expect(swaggerJSDoc).toHaveBeenCalledWith(expect.objectContaining({
            swaggerDefinition: expectedOptions.swaggerDefinition,
            apis: ["**/*.ts"],
        }));
    });

    test('Should call swaggerUi.setup with the result of swaggerJSDoc', () => {
        const port = 3000;
        const swaggerSpec = {};
        (swaggerJSDoc as jest.Mock).mockReturnValue(swaggerSpec);

        Swagger.setup(port);

        expect(swaggerUi.setup).toHaveBeenCalledWith(swaggerSpec);
    });
});
