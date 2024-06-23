import { Box } from '@mui/joy'
import { PanelResizeHandle } from 'react-resizable-panels'

export function ResizeHandle({ direction = 'vertical', size = 2 }) {
    return (
        <Box
            component={PanelResizeHandle}
            sx={{
                width: direction === 'vertical' ? size : undefined,
                height: direction === 'horizontal' ? size : undefined,
                my: 1,
                mx: 1,
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--joy-palette-primary-400)',
                opacity: 0.3,
                '&:hover': {
                    opacity: 0.6,
                },
                '&:active': {
                    opacity: 0.9,
                },
            }}
        />
    )
}
