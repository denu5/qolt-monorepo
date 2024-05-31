import { CssVarsThemeOptions, GlobalStyles } from '@mui/joy'

export const globalStylesProps: React.ComponentProps<typeof GlobalStyles> = {
    styles: {
        ':root': {},
    },
}

const palette = {
    neutral: {
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#e5e5e5',
        '300': '#d4d4d4',
        '400': '#a3a3a3',
        '500': '#737373',
        '600': '#525252',
        '700': '#404040',
        '800': '#262626',
        '900': '#171717',
        solidBg: 'var(--joy-palette-neutral-800)',
        solidHoverBg: 'var(--joy-palette-neutral-900)',
        solidActiveBg: 'var(--joy-palette-neutral-900)',
        solidDisabledColor: 'var(--joy-palette-neutral-900)',
        solidDisabledBg: 'var(--joy-palette-neutral-600)',
    },
}

export const customThemeOptions: CssVarsThemeOptions = {
    colorSchemes: {
        light: {
            palette: {
                primary: palette.neutral,
                background: {
                    // body: '#F5F7FA',
                },
            },
        },
        dark: {
            palette: {
                primary: palette.neutral,
            },
        },
    },
    fontFamily: {
        display: 'var(--app-fontFamily-sans), Arial, sans-serif',
        body: 'var(--app-fontFamily-sans), Arial, sans-serif',
        code: 'var(--app-fontFamily-mono), Monaco, monospace',
    },
    typography: {
        h1: {
            fontFamily: 'var(--app-fontFamily-mono), Arial, serif',
        },
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: {
                    borderRadius: '40px',
                },
            },
        },
        JoyInput: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
        JoyTextarea: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
        JoyAutocomplete: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
        JoyFormLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    // marginBottom: 0,
                },
            },
        },
        JoySelect: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
    },
}
