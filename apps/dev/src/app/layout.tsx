import { GlobalStyles } from '@mui/joy'
import { AppRoot } from '@qolt/app-components'
import { ThemeConfigRegistry as JoyThemeProvider } from '@qolt/app-components/_client'
import * as Nav from './_components/NavItems'
import { customThemeOptions, globalStylesProps } from './theme.config'
import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google'
import 'nprogress/nprogress.css'

const myFontSans = FontSans({
    weight: ['100', '300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--app-fontFamily-sans',
})

const myFontMono = FontMono({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--app-fontFamily-mono',
})

const variableFontClassNames = `${myFontSans.variable} ${myFontMono.variable}`

export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="en" className={variableFontClassNames}>
            <body>
                <GlobalStyles {...globalStylesProps} />
                <JoyThemeProvider themeOptions={customThemeOptions}>
                    <AppRoot.LeftRail>
                        <Nav.Primary />
                        <Nav.Secondary />
                    </AppRoot.LeftRail>
                    <AppRoot.Children>{children}</AppRoot.Children>
                </JoyThemeProvider>
            </body>
        </html>
    )
}
