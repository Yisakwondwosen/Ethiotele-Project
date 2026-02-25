export const SantimSentryTheme = {
    colors: {
        background: '#000000', // Pure Black
        container: '#121212', // Dark Slate
        borderPrimary: '#222222',
        borderSecondary: '#333333',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA', // Zinc 400
        brand: {
            white: '#FFFFFF',
            black: '#000000',
            success: '#10B981',
            danger: '#EF4444',
        }
    },
    typography: {
        fontFamily: {
            sans: '"Outfit", "Inter", sans-serif', // Heavily Geometric for headings
            mono: '"Fira Code", "Roboto Mono", monospace', // Developer/API feel
        },
        sizes: {
            balanceInteger: '2.5rem', // 40px
            balanceDecimal: '1.875rem', // 40px * 0.75 = 30px
            currencySymbol: '1.875rem',
        },
        weights: {
            heavy: 800, // For integer balance
            regular: 400,
        }
    },
    spacing: {
        safeAreaTop: 'env(safe-area-inset-top, 24px)', // Mobile status bar
        base: '8px',
        medium: '16px',
        large: '24px',
    },
    radius: {
        button: '8px', // Consistent not fully rounded
        container: '16px',
    },
    effects: {
        glassmorphism: 'blur(12px)',
        bottomNavBg: 'rgba(0, 0, 0, 0.6)',
    }
};
