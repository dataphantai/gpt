import mammoth from "mammoth";
import pdf from "pdf-extraction";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Configuration, OpenAIApi } from "openai";

import { INFORMATION_NOT_KNOWN_ERROR_MESSAGE } from "../constants/constants.js";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

export const extractTextFromMSDOC = async (buffer) => {
    const res = await mammoth.extractRawText({ buffer });

    return res.value.trim();
};

export const extractTextFromPDF = async (buffer) => {
    const res = await pdf(buffer);

    return res.text.trim();
};

export const recursiveTextSplitter = async (text) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
        chunkOverlap: 0,
    });

    let textChunks = await textSplitter.splitText(text);
    textChunks = textChunks.map((text) => text.split("\n").join(" "));

    return textChunks;
};

export const embedContent = async (content) => {
    const promptEmbedding = await openAI.createEmbedding({
        input: content,
        model: "text-embedding-ada-002",
    });

    return promptEmbedding.data.data;
};

const prepareSystemPrompt = () => `
    You are an assistant that will help me answer questions based on provided document sources.
    I will provide you with some sources in a text format and a questions, and your job is
    to figure out the answer.

    Create the final answer to the given question using ONLY the provided document sources
    (in no particular order) as references.
    
    If you cannot answer the question using the information in the provided sources,
    simply say "${INFORMATION_NOT_KNOWN_ERROR_MESSAGE}".
    
    Important:
    Do not attempt to fabricate an answer that uses any other information outside
    what is provided in the sources.

    Here is an example:
    ---------
    QUESTION: What  is the purpose of ARPA-H?
    =========
    Source 1: More support for patients and families. To get there, I call on Congress to fund ARPA-H, the Advanced Research Projects Agency for Health.It's based on DARPA—the Defense Department project that led to the Internet, GPS, and so much more. ARPA-H will have a singular purpose—to drive breakthroughs in cancer, Alzheimer's, diabetes, and more.
    Source 2: While we're at it, let's make sure every American can get the health care they need.We've already made historic investments in health care.We've made it easier for Americans to get the care they need, when they need it.We've made it easier for Americans to get the treatments they need, when they need them.We've made it easier for Americans to get the medications they need, when they need them.
    Source 3: The V.A. is pioneering new ways of linking toxic exposures to disease, already helping  veterans get the care they deserve.We need to extend that same care to all Americans.That's why I'm calling on Congress to pass legislation that would establish a national registry of toxic exposures, and provide health care and financial assistance to those affected.
    =========
    ANSWER: The purpose of ARPA-H is to drive breakthroughs in cancer, Alzheimer's, diabetes, and more.
`;

export const preparePrompt = (question, sources) => `
    QUESTION: ${question}
    =========
    ${sources
        .map((source, index) => `Source ${index + 1}: ${source.content}`)
        .join("\n")}
    =========
    ANSWER:
    ---------
`;

export const getAnswer = async (prompt) => {
    const response = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: prepareSystemPrompt(),
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 1500,
        temperature: 0,
    });

    return response.data;
};
