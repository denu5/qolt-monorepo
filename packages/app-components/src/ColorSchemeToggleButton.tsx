'use client'

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ListItemButton, { ListItemButtonProps } from '@mui/joy/ListItemButton'
import { useColorScheme } from '@mui/joy/styles'
import { SxProps } from '@mui/joy/styles/types'
import { useEffect, useState } from 'react'

export function ColorSchemeToggleButton({ onClick, sx, ...props }: ListItemButtonProps) {
    const { mode, setMode } = useColorScheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <ListItemButton {...props} sx={sx} disabled />
    }

    const sxProps: SxProps = Array.isArray(sx) ? sx : [sx]
    return (
        <ListItemButton
            id="toggle-mode"
            {...props}
            onClick={(event) => {
                if (mode === 'light') {
                    setMode('dark')
                } else {
                    setMode('light')
                }
                onClick?.(event)
            }}
            sx={[
                {
                    '& > svg[data-testid=LightModeIcon]': {
                        display: mode === 'light' ? 'none' : 'initial',
                    },
                    '& > svg[data-testid=DarkModeIcon]': {
                        display: mode === 'dark' ? 'none' : 'initial',
                    },
                },
                ...sxProps,
            ]}
        >
            <DarkModeIcon />
            <LightModeIcon />
        </ListItemButton>
    )
}
