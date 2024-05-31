'use client'

import { useColorScheme } from '@mui/joy'

export function useAgGridThemeClass(theme = 'balham') {
    const { mode } = useColorScheme()
    return mode === 'dark' ? `ag-theme-${theme}-dark` : `ag-theme-${theme}`
}
