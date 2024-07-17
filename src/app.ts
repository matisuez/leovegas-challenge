import { envs } from "./config/envs";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";

(() => {
    main();
})();

function main() {

    const server = new Server({
        port: envs.PORT,
        env: envs.NODE_ENV,
        routes: AppRoutes.routes,
        publicFolder: envs.PUBLIC_FOLDER,
    });

    server.start();
}


