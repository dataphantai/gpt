import Box from "@mui/material/Box";

const LoadingDots = () => (
    <div className="flex align-center">
        <Box
            className="w-2 h-2 rounded-full mr-1 animate-[load_1.5s_ease-in-out_infinite]"
            sx={(theme) => ({
                background: `${theme.palette.primary.dark}`,
            })}
        />
        <Box
            className="w-2 h-2 rounded-full mr-1 animate-[load_1.5s_ease-in-out_infinite_0.5s]"
            sx={(theme) => ({
                background: `${theme.palette.primary.dark}`,
            })}
        />
        <Box
            className="w-2 h-2 rounded-full animate-[load_1.5s_ease-in-out_infinite_1s]"
            sx={(theme) => ({
                background: `${theme.palette.primary.dark}`,
            })}
        />
    </div>
);

export default LoadingDots;
