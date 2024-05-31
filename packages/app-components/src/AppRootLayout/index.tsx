import { Box } from '@mui/joy'

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
            {children}
        </Box>
    )
}
