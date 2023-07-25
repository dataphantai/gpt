module.exports = {
    important: true,
    content: ["./src/**/*.{css,js}"],
    theme: {
        extend: {
            keyframes: {
                load: {
                    "0%, 100%": {
                        opacity: "0.5",
                        transform: "scale(1, 1)",
                    },
                    "50%": {
                        opacity: "1",
                        transform: "scale(1.25, 1.25)",
                    },
                },
            },
        },
    },
    plugins: [],
};
