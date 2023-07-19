import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail.js";

import {
    SALT_ROUNDS,
    GOOGLE_USER_INFO_API_URL,
    GOOGLE_TOKEN_INVALID_ERROR_MESSAGE,
    EMAIL_INVALID_ERROR_MESSAGE,
    PASSWORD_ERROR_MESSAGE,
    PASSWORDS_MATCH_ERROR_MESSAGE,
    EMAIL_EXISTS_ERROR_MESSAGE,
    GENERIC_SERVER_ERROR_MESSAGE,
} from "../../common/constants/constants.js";
import {
    recursiveTextSplitter,
    embedContent,
} from "../../common/utils/utils.js";
import axios from "../../common/axios/axios.js";

const prisma = new PrismaClient();

const verifyIfUserExists = async (res, email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            return res.status(400).send({
                message: EMAIL_EXISTS_ERROR_MESSAGE,
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

const insertDemoDataForNewUser = async (user) => {
    const buffer = fs.readFileSync("./common/files/pulsar.txt");
    let content = buffer.toString("utf8").trim();
    content = await recursiveTextSplitter(content);

    const documentEmbedding = await embedContent(content);

    const documentId = uuidv4();

    const insertPromises = documentEmbedding.map(
        (embedChunk, index) =>
            prisma.$queryRaw`
                    INSERT INTO "Document" ("documentId", "userId", title, extension, content, vector, "createdAt", "updatedAt")
                    VALUES (${documentId}, ${user.id}, 'pulsar', 'txt', ${
                content[index]
            }, ${embedChunk.embedding}, ${new Date()}, ${new Date()})
                `
    );

    await Promise.all(insertPromises);
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    const isEmailValid = isEmail(email);
    const isPasswordValid = password !== "";
    const arePasswordsEqual = password === confirmPassword;

    if (!isEmailValid) {
        return res.status(400).send({
            message: EMAIL_INVALID_ERROR_MESSAGE,
        });
    }

    if (!isPasswordValid) {
        return res.status(400).send({
            message: PASSWORD_ERROR_MESSAGE,
        });
    }

    if (!arePasswordsEqual) {
        return res.status(400).send({
            message: PASSWORDS_MATCH_ERROR_MESSAGE,
        });
    }

    await verifyIfUserExists(res, email);

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hash,
                },
            });

            await insertDemoDataForNewUser(user);

            return res.status(200).send();
        } catch (err) {
            return res.status(500).send({
                message: GENERIC_SERVER_ERROR_MESSAGE,
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

export const signupWithGoogle = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: GOOGLE_TOKEN_INVALID_ERROR_MESSAGE,
        });
    }

    const googleUserInfoRequest = await axios.get(GOOGLE_USER_INFO_API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { email } = googleUserInfoRequest.data;

    await verifyIfUserExists(res, email);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                googleSignIn: true,
            },
        });

        await insertDemoDataForNewUser(user);

        return res.status(200).send();
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};
