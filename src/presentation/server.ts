import path from 'path';
import { Server as HttpServer, } from 'http';

import cors from 'cors';
import express, { Router, } from 'express';

import { Swagger } from '../config/swagger';
import { errorHandler } from './middlewares';

interface Options {
    env:string;
    port: number;
    routes: Router;
    publicFolder?:string;
}

export class Server {

    public readonly app = express();

    private readonly env:string;
    private readonly port: number;
    private readonly routes: Router;
    private serverListener?: HttpServer;
    private readonly publicFolder: string;

    constructor(options:Options) {
        const {
            env,
            port,
            routes,
            publicFolder = 'public',
        } = options;
        this.env = env;
        this.port = port;
        this.routes = routes;
        this.publicFolder = publicFolder;
    }

    async start() {

        //* Middlewares
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true,
        }));

        //* Swagger documentation
        this.app.use('/api/docs', Swagger.serve, Swagger.setup(this.port));

        //* Routes
        this.app.use('/api', this.routes);

        //* Catch 
        this.app.use('*', (req, res) => {
            const notFoundPath = `/../../${this.publicFolder}/notFound.html`;
            const file = path.join( __dirname + notFoundPath );
            res.status(404).sendFile(file);
        });

        //* Error handler
        this.app.use(errorHandler);

        //* Listener message
        this.startListening();
    }

    private startListening() {
        if (this.env !== 'test') {
            this.serverListener = this.app.listen(this.port, () => {
                console.log(`Server running on port: ${this.port}`);
            });
        } else {
            this.serverListener = this.app.listen();
        }
    }

    public close() {
        this.serverListener?.close();
    }

}