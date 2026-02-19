/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-purple': '#5B45FF', // Deep purple from card/charts
                'brand-orange': '#FF6B4A', // Orange from FAB/Expenses
                'brand-dark': '#1A1A2E',   // Dark text
                'brand-gray': '#F4F6F8',   // Light bg
                'ethio-green': '#009660', // Keeping strictly for logo/branding if needed
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Assuming Inter or similar rounded sans
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 10px 30px -5px rgba(91, 69, 255, 0.3)', // Purple glow
                'glow-orange': '0 10px 30px -5px rgba(255, 107, 74, 0.3)', // Orange glow
            }
        },
    },
    plugins: [],
}
