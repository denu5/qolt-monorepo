import { Box, GlobalStyles } from '@mui/joy'

export * from './LeftRail'
export * from './LeftRailLink'

export function Layout({ children }: React.PropsWithChildren) {
    return <>{children}</>
}

export function Children({ children }: React.PropsWithChildren) {
    return (
        <Box
            sx={{
                ml: 'var(--LeftRail-width)',
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                minHeight: '100dvh',
            }}
        >
            <GlobalStyles
                styles={{
                    ':root': {
                        '--LeftRail-width': '64px',
                    },
                }}
            />
            {children}
        </Box>
    )
}
