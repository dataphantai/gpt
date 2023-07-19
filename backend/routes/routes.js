import multer from "fastify-multer";

import authenticated from "./authenticated/authenticated.js";
import { login, loginWithGoogle } from "./login/login.js";
import { signup, signupWithGoogle } from "./signup/signup.js";
import { deleteDocument, getAll, upload } from "./documents/documents.js";
import answer from "./answer/answer.js";
import auth from "../middlewares/auth.js";
import {
    API_IS_USER_AUTHENTICATED_URL,
    API_LOGIN_URL,
    API_LOGIN_WITH_GOOGLE_URL,
    API_SIGNUP_URL,
    API_SIGNUP_WITH_GOOGLE_URL,
    API_DOCUMENTS_URL,
    API_DOCUMENTS_DELETE_URL,
    API_DOCUMENTS_UPLOAD_URL,
    API_ANSWER_URL,
} from "../common/constants/constants.js";

const uploadMulter = multer();

const routes = [
    {
        method: "GET",
        url: API_IS_USER_AUTHENTICATED_URL,
        preHandler: [auth],
        handler: authenticated,
    },
    {
        method: "POST",
        url: API_LOGIN_URL,
        handler: login,
    },
    {
        method: "POST",
        url: API_LOGIN_WITH_GOOGLE_URL,
        handler: loginWithGoogle,
    },
    {
        method: "POST",
        url: API_SIGNUP_URL,
        handler: signup,
    },
    {
        method: "POST",
        url: API_SIGNUP_WITH_GOOGLE_URL,
        handler: signupWithGoogle,
    },
    {
        method: "GET",
        url: API_DOCUMENTS_URL,
        preHandler: [auth],
        handler: getAll,
    },
    {
        method: "DELETE",
        url: API_DOCUMENTS_DELETE_URL,
        preHandler: [auth],
        handler: deleteDocument,
    },
    {
        method: "POST",
        url: API_DOCUMENTS_UPLOAD_URL,
        preHandler: [auth, uploadMulter.single("document")],
        handler: upload,
    },
    {
        method: "POST",
        url: API_ANSWER_URL,
        preHandler: [auth],
        handler: answer,
    },
];

export default routes;
