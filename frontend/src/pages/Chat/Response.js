import { useCallback } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined";

import LoadingDots from "common/components/LoadingDots/LoadingDots";

import { QAGPT_REQUEST_IN_FLIGHT_MESSAGE } from "common/constants/constants";

const SourceAccordion = ({ sourceNumber, source }) => {
    return (
        <Accordion
            sx={(theme) => ({
                background: `${theme.palette.grey["800"]}`,
            })}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                    Source {sourceNumber + 1} - {source.title}.
                    {source.extension}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{source.content}</Typography>
            </AccordionDetails>
        </Accordion>
    );
};

const DemoQuestion = ({ question, setPromptInChat, requestInFlight }) => {
    const onClick = useCallback(() => {
        if (!requestInFlight) {
            setPromptInChat(question);
        }
    }, [question, setPromptInChat, requestInFlight]);

    return (
        <ListItem className="p-0">
            <ListItemButton onClick={onClick} disabled={requestInFlight}>
                <ListItemText className="m-0" primary={question} />
            </ListItemButton>
        </ListItem>
    );
};

const Response = ({
    text,
    data = null,
    initial = false,
    setPromptInChat,
    requestInFlight,
    className,
    ...rest
}) => (
    <Box className={`flex justify-start ${className}`} {...rest}>
        <Paper className="w-fit md:max-lg:max-w-[100%] max-w-[50%] p-4">
            {text !== QAGPT_REQUEST_IN_FLIGHT_MESSAGE ? (
                <>
                    <Typography variant="body1">{text}</Typography>
                    {data ? (
                        initial ? (
                            <List className="mt-8 p-0">
                                {data.map((question, index) => (
                                    <DemoQuestion
                                        key={index}
                                        question={question}
                                        setPromptInChat={setPromptInChat}
                                        requestInFlight={requestInFlight}
                                    />
                                ))}
                            </List>
                        ) : (
                            <Box className="mt-8">
                                {data.map((source, index) => (
                                    <SourceAccordion
                                        key={index}
                                        sourceNumber={index}
                                        source={source}
                                    />
                                ))}
                            </Box>
                        )
                    ) : null}
                </>
            ) : (
                <LoadingDots />
            )}
        </Paper>
    </Box>
);

export default Response;
