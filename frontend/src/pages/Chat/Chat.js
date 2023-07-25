import { useCallback, useEffect, useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/SendOutlined";
import MicOnIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffIcon from "@mui/icons-material/MicOffOutlined";

import Page from "common/components/Page/Page";
import Menu from "common/components/Menu/Menu";
import Prompt from "pages/Chat/Prompt";
import Response from "pages/Chat/Response";

import {
    QAGPT_CHAT_PARTICIPANT,
    USER_CHAT_PARTICIPANT,
    QAGPT_REQUEST_IN_FLIGHT_MESSAGE,
    QAGPT_FAILED_ANSWER_MESSAGE,
    QAGPT_ANSWER_TEMPLATE,
    API_ANSWER_URL,
    LS_TOKEN_KEY,
} from "common/constants/constants";
import useKeyPress from "common/hooks/useKeyPress";
import { scrollToBottom } from "common/utils/utils";
import axios from "common/axios/axios";

const Chat = () => {
    const [prompt, setPrompt] = useState("");
    const [voiceStarted, setVoiceStarted] = useState(false);
    const [requestInFlight, setRequestInFlight] = useState(false);
    const [chat, setChat] = useState([
        {
            user: QAGPT_CHAT_PARTICIPANT,
            message:
                "Hello. I am here to help. Type your question below. If you don't know where to start, we have already uploaded for you a document about pulsars so you can try one of the example questions. If you choose to delete the document (from the Manage Documents section), the questions will no longer be relevant.",
            data: [
                "What is a pulsar?",
                "When were pulsars first discovered?",
                "What are the main categories of pulsars?",
                "What is a disrupted recycled pulsar?",
            ],
            initial: true,
        },
    ]);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const chatBox = useRef(null);
    const recognition = useRef(null);

    const getAnswer = useCallback(async () => {
        const lastUserMessage = chat.findLast(
            (chatMessage) => chatMessage.user === USER_CHAT_PARTICIPANT
        );

        try {
            const res = await axios.post(
                API_ANSWER_URL,
                {
                    prompt: lastUserMessage.message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            LS_TOKEN_KEY
                        )}`,
                    },
                }
            );

            const { data } = res;

            // Replace the last item in array since we now have GPT's answer
            setChat([
                ...chat.slice(0, chat.length - 1),
                {
                    user: QAGPT_CHAT_PARTICIPANT,
                    message: data.answer.replace(QAGPT_ANSWER_TEMPLATE, ""),
                    data: data.sources,
                    initial: false,
                },
            ]);
        } catch (err) {
            enqueueSnackbar(err.response.data.message, {
                variant: "error",
            });

            // Replace with a generic message that says it cannot answer the question
            setChat([
                ...chat.slice(0, chat.length - 1),
                {
                    user: QAGPT_CHAT_PARTICIPANT,
                    message: QAGPT_FAILED_ANSWER_MESSAGE,
                    data: null,
                    initial: false,
                },
            ]);
        } finally {
            scrollToBottom(chatBox.current);

            setRequestInFlight(false);
        }
    }, [chat]);

    const setPromptInChat = useCallback(
        (prompt) => {
            setChat([
                ...chat,
                {
                    user: USER_CHAT_PARTICIPANT,
                    message: prompt.trim(),
                },
                {
                    user: QAGPT_CHAT_PARTICIPANT,
                    message: QAGPT_REQUEST_IN_FLIGHT_MESSAGE,
                    data: null,
                    initial: false,
                },
            ]);

            scrollToBottom(chatBox.current);

            setPrompt("");

            setTimeout(() => setRequestInFlight(true), 0);
        },
        [chat]
    );

    useEffect(() => {
        if (requestInFlight) {
            getAnswer();
        }
    }, [requestInFlight, getAnswer]);

    useEffect(
        () => {
            if (recognition.current) {
                if (voiceStarted) {
                    recognition.current.onresult = (e) => {
                        const { resultIndex, results } = e;

                        if (!results[resultIndex].isFinal) {
                            const spokenPrompt = Object.keys(results)
                                .map((key) => results[key][0].transcript)
                                .join("");

                            setPrompt(spokenPrompt);
                        }
                    };

                    recognition.current.start();
                } else {
                    if (prompt.trim() !== "") {
                        setPromptInChat(prompt);
                    }

                    recognition.current.stop();
                }
            }
        },
        // eslint-disable-next-line
        [voiceStarted]
    );

    useEffect(() => {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const SpeechGrammarList = window.webkitSpeechGrammarList;

        if (SpeechRecognition && SpeechGrammarList) {
            recognition.current = new SpeechRecognition();
            recognition.current.grammars = new SpeechGrammarList();
            recognition.current.lang = "en-US";
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.maxAlternatives = 1;

            setVoiceSupported(true);
        }
    }, []);

    useKeyPress("Enter", () => setPromptInChat(prompt));

    return (
        <Page pageName="chat">
            <Menu />
            <div className="flex flex-col h-screen p-8 grow">
                <Box className="mb-4 overflow-y-auto grow" ref={chatBox}>
                    {chat.map((chatMessage, index) =>
                        chatMessage.user === QAGPT_CHAT_PARTICIPANT ? (
                            <Response
                                key={index}
                                className={index > 0 ? "mt-4" : ""}
                                text={chatMessage.message}
                                data={chatMessage.data}
                                initial={chatMessage.initial}
                                setPromptInChat={setPromptInChat}
                                requestInFlight={requestInFlight}
                            />
                        ) : (
                            <Prompt
                                key={index}
                                className={index > 0 ? "mt-4" : ""}
                                text={chatMessage.message}
                            />
                        )
                    )}
                </Box>
                <Paper className="flex items-center p-4">
                    <TextField
                        id="chatPrompt"
                        sx={{
                            ".MuiInput-root, .Mui-focused": {
                                padding: 0,
                                "&:hover, &::before, &::after, &:hover::before, &:hover::after":
                                    {
                                        border: "0 !important",
                                    },
                            },
                        }}
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        placeholder="Write your message here."
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        disabled={
                                            requestInFlight ||
                                            prompt.trim() === "" ||
                                            voiceStarted
                                        }
                                        onClick={() => setPromptInChat(prompt)}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={requestInFlight}
                    />
                    {voiceSupported && (
                        <IconButton
                            className="ml-4"
                            disabled={requestInFlight}
                            onClick={() =>
                                setVoiceStarted((voiceStarted) => !voiceStarted)
                            }
                        >
                            {!voiceStarted ? (
                                <MicOffIcon className="cursor-pointer" />
                            ) : (
                                <MicOnIcon className="cursor-pointer" />
                            )}
                        </IconButton>
                    )}
                </Paper>
            </div>
        </Page>
    );
};

export default Chat;
