import env from "dotenv";
import Fastify from "fastify";
import multer from "fastify-multer";
import cors from "@fastify/cors";

import routes from "./routes/routes.js";

env.config();

const server = Fastify({
    logger: true,
});

const upload = multer();
server.register(upload.contentParser);

routes.forEach((route) => server.route(route));

const start = async () => {
    try {
        await server.register(cors, {
            origin: "*",
        });

        await server.listen({ port: process.env.PORT || 80, host: "0.0.0.0" });
    } catch (error) {
        console.log(error);

        process.exit(1);
    }
};

start();
