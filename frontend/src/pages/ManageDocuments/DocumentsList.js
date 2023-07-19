import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const DocumentsList = ({ documents, deleteDocument }) => {
    return (
        <Box>
            <Typography variant="body1" className="mb-4">
                Your uploaded documents.
            </Typography>
            <Paper className="p-4 overflow-hidden">
                {documents.length === 0 ? (
                    <Typography variant="body2">No documents found.</Typography>
                ) : (
                    <TableContainer className="max-h-96">
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow
                                    sx={(theme) => ({
                                        "&:last-child th": {
                                            background: `${theme.palette.primary.dark}`,
                                            border: 0,
                                        },
                                    })}
                                >
                                    <TableCell>File name</TableCell>
                                    <TableCell>File extension</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document.documentId}>
                                        <TableCell>{document.title}</TableCell>
                                        <TableCell>
                                            {"."}
                                            {document.extension}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() =>
                                                    deleteDocument(
                                                        document.documentId
                                                    )
                                                }
                                            >
                                                <DeleteIcon
                                                    sx={(theme) => ({
                                                        color: `${theme.palette.error.light}`,
                                                    })}
                                                />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="border-0 p-4">
                                        Total: {documents.length} items
                                    </TableCell>
                                    <TableCell
                                        className="border-0 p-4"
                                        align="right"
                                    ></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default DocumentsList;
