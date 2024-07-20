
import 'dotenv/config';
import {get} from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').required().asString(),

    JWT_SECRET: get('JWT_SECRET').required().asString(),

    PUBLIC_FOLDER: get('PUBLIC_FOLDER').required().asString(),
};

