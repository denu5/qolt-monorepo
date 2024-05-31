import { Box } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

export function SidebarBody({ children, sx }: React.PropsWithChildren<{ sx?: SxProps }>) {
    return (
        <Box
            className="Sidebar__Body"
            sx={{
                minHeight: 0,
                overflow: 'hidden auto',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                ...sx,
            }}
        >
            {children}
        </Box>
    )
}
