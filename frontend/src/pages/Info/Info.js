import Typography from "@mui/material/Typography";

import Page from "common/components/Page/Page";
import Menu from "common/components/Menu/Menu";

const NotFound = () => {
    return (
        <Page pageName="chat">
            <Menu />
            <div className="flex flex-col h-screen p-8 grow overflow-y-auto">
                <Typography variant="h5" className="mb-4">
                    What is QAGPT?
                </Typography>
                <Typography className="mb-4">
                    QAGPT is your friendly neighborhood software app, built to
                    tackle the often tedious job of navigating through heaps of
                    text in your documents. It's like that handy assistant that
                    dives into your digital paperwork and pulls out just the
                    info you're looking for. Born out of the impressive AI
                    lineage of OpenAI's GPT series, QAGPT wields the power of
                    Retrieval Augmented Generation, meaning it smartly sorts,
                    understands, and recalls info from your docs.
                </Typography>
                <Typography className="mb-4">
                    Think of QAGPT as a brainy buddy for your files. You feed it
                    a question, it goes on a hunt through your uploaded
                    documents, and voila - you get the exact chunk of info you
                    were looking for. Whether you're a student buried in
                    research papers, a professional crunching reports, or just
                    someone lost in a sea of digital text, QAGPT is your go-to
                    sidekick. It simplifies the daunting task of data retrieval
                    with a friendly interface that turns Q&A with your files
                    into a piece of cake. It's more than just a search engine;
                    it's an insight engine understanding the context of your
                    queries. With QAGPT, unlocking the secrets in your documents
                    is as easy as asking a question.
                </Typography>
                <Typography variant="h5" className="mb-4">
                    How can I use it?
                </Typography>
                <Typography className="mb-4">
                    The{" "}
                    <Typography className="font-bold" component="span">
                        "Ask Questions"
                    </Typography>{" "}
                    section is where the magic happens in QAGPT. Think of it
                    like your personal genie lamp; you pose a question, and
                    QAGPT does its magic to grant your wish for an answer. It
                    comes loaded with some ready-to-go queries based on a
                    default document, so you can take it for a spin right out of
                    the gate. But don't think you're confined to these starter
                    questions. You can ask anything about your uploaded
                    documents, and QAGPT will hustle to get you the answer. It's
                    like having a conversation with your files!
                </Typography>
                <Typography className="mb-4">
                    Now here's where the fun really kicks in. You can type your
                    question into a chat, sure. But if you're feeling a bit more
                    futuristic, why not just ask your question out loud? Click
                    on the microphone button and speak your query. QAGPT, like
                    the clever creature it is, has a built-in speech-to-text
                    engine that will turn your spoken words into a text
                    question. So whether you're more comfortable typing or
                    talking, QAGPT has got your back.
                </Typography>
                <Typography className="mb-4">
                    And here's the kicker: QAGPT always has an answer. If it
                    finds relevant info in your documents, it'll serve it up on
                    a silver platter. If not, it won't leave you hanging. It'll
                    be upfront and tell you "I don't know." Either way, you're
                    never left in the dark. With QAGPT, you're always just a
                    question away from unveiling the treasure hidden in your
                    texts.
                </Typography>
                <Typography className="mb-4">
                    The{" "}
                    <Typography className="font-bold" component="span">
                        "Manage Documents"
                    </Typography>{" "}
                    section in QAGPT is like your personal library where you
                    hold all the treasures (or texts) that QAGPT will search
                    through for answers. Got a document you want to dive into?
                    Just click the "browse" button and upload it. QAGPT is
                    pretty versatile and can handle .txt, .pdf, .doc, and .docx
                    formats, as long as the files aren't more than 10 MB each.
                    So, whether it's an old report or a fresh-out-of-the-oven
                    thesis, QAGPT can handle it.
                </Typography>
                <Typography className="mb-4">
                    Right under the upload button, you'll see a neat little
                    table that lists all your uploaded documents. It's like your
                    own mini file cabinet. You can see what's on deck for QAGPT
                    to scour through, and if you change your mind, you can
                    remove any document from the list with a simple click. No
                    fuss, no muss!
                </Typography>
                <Typography className="mb-4">
                    Now, there's something cool we've added to make your first
                    QAGPT adventure a little more exciting. We've uploaded a
                    default document all about pulsar stars (they're like cosmic
                    lighthouses, and super cool!). So, you can start
                    experimenting with questions right away, using the default
                    document and demo questions we've set up for you. And
                    remember, QAGPT only searches through your uploaded
                    documents to answer your questions, not the entire digital
                    universe.
                </Typography>
                <Typography className="mb-4">
                    But, before we go any further, here's a super important
                    note:{" "}
                    <Typography
                        component="span"
                        sx={(theme) => ({
                            color: `${theme.palette.error.light}`,
                        })}
                    >
                        please don't upload documents that contain sensitive or
                        confidential information
                    </Typography>
                    . QAGPT is like your friendly local librarian - always ready
                    to help, but doesn't want to know your personal secrets.
                    We've designed QAGPT to help you retrieve and understand
                    your data, not to keep it safe. If confidential info is
                    uploaded and something goes wrong, QAGPT is not to blame.
                    So, think of QAGPT as a detective, not a security guard.
                    That way, we all stay happy and your secrets stay safe.
                    Happy querying!
                </Typography>
                <Typography variant="h5">Happy questioning!</Typography>
            </div>
        </Page>
    );
};

export default NotFound;
