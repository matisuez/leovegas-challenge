
import 'dotenv/config';
import {get} from 'env-var';

export const envs = {
    NODE_ENV: get('NODE_ENV').required().asString(),
    PORT: get('PORT').required().asPortNumber(),
};

