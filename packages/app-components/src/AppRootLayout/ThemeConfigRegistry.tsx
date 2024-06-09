import { CssBaseline, CssVarsProvider, getInitColorSchemeScript, CssVarsThemeOptions } from '@mui/joy'
import { extendTheme } from '@mui/joy'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import React from 'react'
import { Suspense } from 'react'

import { NProgressDone } from 'NLink'

type ThemeConfigRegistryProps = {
    children: React.ReactNode
    themeOptions?: CssVarsThemeOptions
}

export function ThemeConfigRegistry({ children, themeOptions }: React.PropsWithChildren<ThemeConfigRegistryProps>) {
    const theme = extendTheme(themeOptions ?? {})

    return (
        <AppRouterCacheProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <NProgressDone />
            </Suspense>
            {getInitColorSchemeScript()}
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </AppRouterCacheProvider>
    )
}
