import { Box } from '@mui/joy'
import Sheet from '@mui/joy/Sheet'

export function Header({ children }: React.PropsWithChildren) {
    return (
        <Box component="header">
            <Sheet
                sx={{
                    position: 'fixed',
                    background: 'hsla(0,0%,100%,.8)',
                    // boxShadow: 'inset 0 -1px 0 0 var(--joy-palette-divider)',
                    backdropFilter: 'saturate(180%) blur(5px)',
                    top: 0,
                    left: 'var(--LeftRail-width)',
                    right: 0,
                    zIndex: 9995,
                    py: 1,
                    px: 2,
                    height: '48px',
                }}
            >
                <>{children}</>
            </Sheet>
            <Box sx={{ height: '48px' }} />
        </Box>
    )
}
