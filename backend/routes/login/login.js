import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail.js";

import {
    JWT_TOKEN_EXPIRY_TIME,
    EMAIL_INVALID_ERROR_MESSAGE,
    PASSWORD_ERROR_MESSAGE,
    EMAIL_PASSWORD_ERROR_MESSAGE,
    EMAIL_NONEXISTENT_ERROR_MESSAGE,
    GENERIC_SERVER_ERROR_MESSAGE,
    GOOGLE_USER_INFO_API_URL,
} from "../../common/constants/constants.js";
import axios from "../../common/axios/axios.js";

const prisma = new PrismaClient();

const createJWTTokenForUser = (res, user) => {
    const { id, email } = user;

    const token = jwt.sign(
        {
            id,
            email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: JWT_TOKEN_EXPIRY_TIME,
        }
    );

    user.token = token;

    return res.status(200).send(user);
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const isEmailValid = isEmail(email);
    const isPasswordValid = password !== "";

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

    // Check to see if email exists and if passwords match
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            try {
                const match = await bcrypt.compare(
                    password,
                    user.password || ""
                );

                if (match) {
                    createJWTTokenForUser(res, user);
                } else {
                    return res.status(400).send({
                        message: EMAIL_PASSWORD_ERROR_MESSAGE,
                    });
                }
            } catch (err) {
                return res.status(500).send({
                    message: GENERIC_SERVER_ERROR_MESSAGE,
                });
            }
        } else {
            return res.status(400).send({
                message: EMAIL_NONEXISTENT_ERROR_MESSAGE,
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

export const loginWithGoogle = async (req, res) => {
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

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            if (!user.googleSignIn) {
                await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        googleSignIn: true,
                    },
                });
            }

            createJWTTokenForUser(res, user);
        } else {
            return res.status(400).send({
                message: EMAIL_NONEXISTENT_ERROR_MESSAGE,
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};
