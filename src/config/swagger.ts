
import { RequestHandler } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class Swagger {

    static setup(port:number): RequestHandler {
        const swaggerOptions = {
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
                    servers: [`http://localhost:${ port }`],
                },
            },
            apis: ['**/*.ts'],
        };
        return swaggerUi.setup(swaggerJSDoc(swaggerOptions));
    }

    static get serve() {
        return swaggerUi.serve;
    }

}
