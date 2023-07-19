import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import {
    AUTH_TOKEN_MISSING_ERROR_MESSAGE,
    AUTH_TOKEN_EXPIRED_ERROR_MESSAGE,
    AUTH_TOKEN_INVALID_ERROR_MESSAGE,
    AUTH_TOKEN_FAILED_ERROR_MESSAGE,
} from "../common/constants/constants.js";

const prisma = new PrismaClient();

const auth = async (req, res) => {
    const authorizationHeader = req.headers.authorization;

    // Verify that header exists
    if (!authorizationHeader) {
        reply.code(401).send({
            message: AUTH_TOKEN_MISSING_ERROR_MESSAGE,
        });
    }

    const token = authorizationHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        // Verify that the user with this email exists
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.code(401).send({
                message: AUTH_TOKEN_FAILED_ERROR_MESSAGE,
            });
        } else {
            req.user = user;
        }
    } catch (err) {
        const { name } = err;

        // Token expired
        if (name === "TokenExpiredError") {
            return res.code(401).send({
                message: AUTH_TOKEN_EXPIRED_ERROR_MESSAGE,
            });
        } else {
            // Token invalid
            return res.code(401).send({
                message: AUTH_TOKEN_INVALID_ERROR_MESSAGE,
            });
        }
    }
};

export default auth;
