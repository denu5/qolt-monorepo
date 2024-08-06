import { AppRoot } from '@qolt/app-components'
import { ThemeConfigRegistry as JoyThemeProvider } from '@qolt/app-components/_client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata, Viewport } from 'next'
import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google'

import * as Nav from './_components/NavItems'
import Link from 'next/link'
import { routes } from './rootManifest'

const myFontSans = FontSans({
    weight: ['100', '300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--my-font-sans',
})

const myFontMono = FontMono({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--my-font-mono',
})

const variableFontClassNames = `${myFontSans.variable} ${myFontMono.variable}`

function Navigation() {
    return (
        <nav>
            <Link href={routes.home.buildUrl()}>Home</Link>
            <Link href={routes.purl.buildUrl({ slug: 'github:lukemorales:query-key-factory' })}>query-key-factory</Link>
            <Link href={routes.article.buildUrl({ slug: ['digest', 'future-of-ai-perplexity'] })}>
                Next.js Routing Article
            </Link>
            <Link href={routes.page.buildUrl({ slug: ['legal'] })}>Legal</Link>
        </nav>
    )
}

export default function RootLayout({ children }: React.PropsWithChildren) {
    return (
        <html lang="en" className={variableFontClassNames}>
            <body>
                <JoyThemeProvider>
                    <AppRoot.Layout>
                        <AppRoot.LeftRail>
                            <Nav.Primary />
                            <Nav.Secondary />
                        </AppRoot.LeftRail>

                        <AppRoot.Children>
                            {children}
                        </AppRoot.Children>
                    </AppRoot.Layout>
                    <Analytics />
                    <SpeedInsights />
                </JoyThemeProvider>
            </body>
        </html>
    )
}

const sharedTitle = 'denu5'
const sharedDescription = 'playground website'
export const sharedImage = {
    width: 1200,
    height: 630,
    type: 'image/png',
}

export const metadata: Metadata = {
    metadataBase: new URL('https://denu5.com'),
    robots: {
        index: true,
        follow: true,
    },
    title: {
        template: `%s — ${sharedTitle}`,
        default: sharedTitle,
    },
    creator: 'denu5',
    description: sharedDescription,
    openGraph: {
        title: {
            template: `%s — ${sharedTitle}`,
            default: sharedTitle,
        },
        description: sharedDescription,
        type: 'website',
        url: '/',
        siteName: sharedTitle,
        locale: 'en_IE',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}
