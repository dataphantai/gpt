import pg from "pg";

import {
    NO_PROMPT_RECEIVED_ERROR_MESSAGE,
    INFORMATION_NOT_IN_DOCUMENTS_ERROR_MESSAGE,
    INFORMATION_NOT_KNOWN_ERROR_MESSAGE,
    GENERIC_SERVER_ERROR_MESSAGE,
    MAX_NUMBER_OF_SOURCES,
    MAX_DISTANCE,
} from "../../common/constants/constants.js";
import {
    embedContent,
    preparePrompt,
    getAnswer,
} from "../../common/utils/utils.js";

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
});
await client.connect();

const answer = async (req, res) => {
    const { user } = req;
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({
            message: NO_PROMPT_RECEIVED_ERROR_MESSAGE,
        });
    }

    try {
        const promptEmbedding = await embedContent(prompt);
        const promptEmbeddingStr = promptEmbedding[0].embedding
            .toString()
            .replace(/\.\.\./g, "");

        const sources = await client.query(`
            SELECT * FROM
                (SELECT title, content, extension,
                        (vector <=> '[${promptEmbeddingStr}]') AS distances
                FROM "Document"
                WHERE "Document"."userId" = ${user.id}) subquery
            WHERE subquery.distances < ${MAX_DISTANCE}
            ORDER BY subquery.distances ASC
            LIMIT ${MAX_NUMBER_OF_SOURCES}
        `);
        const { rows } = sources;

        if (rows.length) {
            const openAIPrompt = preparePrompt(prompt, rows);

            const gptAnswer = await getAnswer(openAIPrompt);
            const answer = gptAnswer.choices[0].text;

            if (answer.includes(INFORMATION_NOT_KNOWN_ERROR_MESSAGE)) {
                return res.status(200).send({
                    sources: null,
                    answer: INFORMATION_NOT_KNOWN_ERROR_MESSAGE,
                });
            } else {
                return res.status(200).send({
                    sources: rows,
                    answer,
                });
            }
        } else {
            return res.status(200).send({
                sources: null,
                answer: INFORMATION_NOT_IN_DOCUMENTS_ERROR_MESSAGE,
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: GENERIC_SERVER_ERROR_MESSAGE,
        });
    }
};

export default answer;
