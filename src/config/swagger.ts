import path from 'path';
import YAML from 'yamljs';
import { RequestHandler } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const authDefinition = YAML.load(path.join(__dirname, '../presentation/auth/definitions.yml'));
const usersDefinition = YAML.load(path.join(__dirname, '../presentation/users/definitions.yml'));
const adminDefinition = YAML.load(path.join(__dirname, '../presentation/admin/definitions.yml'));

const combinedSchemas = {
    ...authDefinition.components.schemas,
    ...usersDefinition.components.schemas,
    ...adminDefinition.components.schemas,
};

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
                    servers: [`http://localhost:${ port }/api`],
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                    schemas: combinedSchemas,
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
