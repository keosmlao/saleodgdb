export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                'noto-lao': ['Noto Sans Lao', 'sans-serif'],
                'times': ['"Times New Roman"', 'serif'],
                'custom-sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                'info-start': '#17a2b8',
                'info-end': '#63c2de',
            },
        },
    },
    plugins: [],
};