module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    variants: {
        opacity: ["hover"],
    },
    theme: {
        extend: {
            screens: {
                xs: "512px",
                "2xs": "384px",
            },
            colors: {
                renblue: {
                    50: "#508cff",
                    100: "#4682f8",
                    200: "#3c78ee",
                    300: "#326ee4",
                    400: "#2864da",
                    500: "#1e5ad0",
                    600: "#1450c6",
                    700: "#0a46bc",
                    800: "#003cb2",
                    900: "#0032a8",
                },
            },
        },
    },
    plugins: [],
};
