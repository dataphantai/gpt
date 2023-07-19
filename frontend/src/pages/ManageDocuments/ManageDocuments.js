import { useEffect, useCallback, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Page from "common/components/Page/Page";
import Menu from "common/components/Menu/Menu";
import DocumentsList from "pages/ManageDocuments/DocumentsList";

import {
    API_DOCUMENTS_URL,
    API_DOCUMENTS_UPLOAD_URL,
    LS_TOKEN_KEY,
    MAX_FILE_SIZE,
    FILE_SIZE_TOO_BIG_MESSAGE,
    FILE_UPLOAD_SUCCESS_MESSAGE,
    FILE_DELETE_SUCCESS_MESSAGE,
} from "common/constants/constants";
import axios from "common/axios/axios";

const ManageDocuments = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [documentUploadInProgress, setDocumentUploadInProgress] =
        useState(null);
    const documentInput = useRef(null);

    const getAllDocuments = useCallback(async () => {
        try {
            const documents = await axios.get(API_DOCUMENTS_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        LS_TOKEN_KEY
                    )}`,
                },
            });

            setUploadedDocuments(documents.data);
        } catch (err) {
            enqueueSnackbar(err.response.data.message, {
                variant: "error",
            });
        }
    }, []);

    const deleteDocument = useCallback(
        async (documentId) => {
            try {
                await axios.delete(`${API_DOCUMENTS_URL}/${documentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            LS_TOKEN_KEY
                        )}`,
                    },
                });

                enqueueSnackbar(FILE_DELETE_SUCCESS_MESSAGE, {
                    variant: "success",
                });

                getAllDocuments();
            } catch (err) {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                });
            }
        },
        [getAllDocuments]
    );

    const uploadDocument = useCallback(
        async (document) => {
            const { size } = document;

            // Check size to be less than 10 MB
            // Size is expressed in bytes
            if (size > MAX_FILE_SIZE) {
                enqueueSnackbar(FILE_SIZE_TOO_BIG_MESSAGE, {
                    variant: "error",
                });

                documentInput.current.value = null;

                return;
            }

            const formData = new FormData();
            formData.append("document", document);

            setDocumentUploadInProgress(true);

            try {
                await axios.post(API_DOCUMENTS_UPLOAD_URL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem(
                            LS_TOKEN_KEY
                        )}`,
                    },
                });

                enqueueSnackbar(FILE_UPLOAD_SUCCESS_MESSAGE, {
                    variant: "success",
                });

                getAllDocuments();
            } catch (err) {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                });
            } finally {
                documentInput.current.value = null;

                setDocumentUploadInProgress(false);
            }
        },
        [getAllDocuments]
    );

    const onClick = useCallback(() => documentInput.current.click(), []);

    const onChange = useCallback(
        (event) => uploadDocument(event.target.files[0]),
        [uploadDocument]
    );

    useEffect(() => {
        getAllDocuments();
    }, [getAllDocuments]);

    return (
        <Page pageName="manageDocuments">
            <Menu />
            <div className="h-screen p-8 grow overflow-y-auto">
                <Box className="mb-16">
                    <Typography variant="body1" className="mb-2">
                        Upload documents by clicking the "Browse" button below.
                    </Typography>
                    <Typography
                        variant="body2"
                        className="mb-4"
                        sx={(theme) => ({
                            color: `${theme.palette.error.light}`,
                        })}
                    >
                        Do not upload documents containing confidential
                        information.
                    </Typography>
                    <input
                        type="file"
                        ref={documentInput}
                        className="hidden"
                        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, text/plain"
                        onChange={onChange}
                    />
                    <Button
                        variant="contained"
                        onClick={onClick}
                        disabled={documentUploadInProgress}
                    >
                        Browse
                    </Button>
                </Box>
                {uploadedDocuments && (
                    <DocumentsList
                        documents={uploadedDocuments}
                        deleteDocument={deleteDocument}
                    />
                )}
            </div>
        </Page>
    );
};

export default ManageDocuments;
