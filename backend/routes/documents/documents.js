import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

import {
    NO_DOCUMENT_RECEIVED_ERROR_MESSAGE,
    EXTENSION_NOT_SUPPORTED_ERROR_MESSAGE,
    GENERIC_SERVER_ERROR_MESSAGE,
    FILE_SIZE_TOO_BIG_ERROR_MESSAGE,
    MAX_FILE_SIZE,
} from "../../common/constants/constants.js";
import {
    recursiveTextSplitter,
    embedContent,
    extractTextFromMSDOC,
    extractTextFromPDF,
} from "../../common/utils/utils.js";

const prisma = new PrismaClient();

const extractDocumentContent = async (file) => {
    const { mimetype, buffer } = file;
    let content = "";

    switch (mimetype) {
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            content = await extractTextFromMSDOC(buffer);
            break;
        case "application/pdf":
            content = await extractTextFromPDF(buffer);
            break;
        case "text/plain":
            content = buffer.toString("utf8").trim();
            break;
        default:
            break;
    }

    content = recursiveTextSplitter(content);

    return content;
};

const getAll = async (req, res) => {
    const { user } = req;

    try {
        const documents = await prisma.document.findMany({
            distinct: ["documentId"],
            select: {
                id: false,
                documentId: true,
                userId: true,
                title: true,
                extension: true,
                content: false,
                createdAt: false,
                updatedAt: false,
            },
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).send(documents);
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

const deleteDocument = async (req, res) => {
    const { user, params } = req;
    const { documentId } = params;

    try {
        const documents = await prisma.document.findMany({
            where: {
                userId: user.id,
            },
        });

        const found = documents.find((document) => document.userId === user.id);

        // Do not allow deleting based only on documentId
        if (!found) {
            return res.code(401).send({
                message: AUTH_TOKEN_FAILED_ERROR_MESSAGE,
            });
        }

        await prisma.document.deleteMany({
            where: {
                documentId: documentId,
            },
        });

        return res.status(200).send();
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

const upload = async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).send({
            message: NO_DOCUMENT_RECEIVED_ERROR_MESSAGE,
        });
    }

    const { user } = req;
    const { size } = file;
    const splitDocumentName = file.originalname.split(".");
    const title = splitDocumentName[0];
    const extension = splitDocumentName[splitDocumentName.length - 1];

    if (
        extension !== "pdf" &&
        extension !== "doc" &&
        extension !== "docx" &&
        extension !== "txt"
    ) {
        return res.status(400).send({
            message: EXTENSION_NOT_SUPPORTED_ERROR_MESSAGE,
        });
    }

    if (size > MAX_FILE_SIZE) {
        return res.status(400).send({
            message: FILE_SIZE_TOO_BIG_ERROR_MESSAGE,
        });
    }

    try {
        const content = await extractDocumentContent(file);

        const documentEmbedding = await embedContent(content);

        const documentId = uuidv4();

        const insertPromises = documentEmbedding.map(
            (embedChunk, index) =>
                prisma.$queryRaw`
                    INSERT INTO "Document" ("documentId", "userId", title, extension, content, vector, "createdAt", "updatedAt")
                    VALUES (${documentId}, ${
                    user.id
                }, ${title}, ${extension}, ${content[index]}, ${
                    embedChunk.embedding
                }, ${new Date()}, ${new Date()})
                `
        );

        await Promise.all(insertPromises);

        return res.status(200).send();
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

export { getAll, deleteDocument, upload };
