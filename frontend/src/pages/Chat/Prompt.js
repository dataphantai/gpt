import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Prompt = ({ text, className, ...rest }) => (
    <Box className={`flex justify-end ${className}`} {...rest}>
        <Paper
            className="w-fit lg:max-w-[50%] max-w-[100%] p-4"
            sx={(theme) => ({
                backgroundColor: `${theme.palette.primary.dark}`,
            })}
        >
            <Typography variant="body1">{text}</Typography>
        </Paper>
    </Box>
);

export default Prompt;
