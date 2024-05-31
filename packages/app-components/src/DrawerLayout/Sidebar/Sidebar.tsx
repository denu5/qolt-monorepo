import { GlobalStyles, Sheet } from '@mui/joy'

export function Sidebar({ children }: React.PropsWithChildren) {
    return (
        <Sheet
            className="Sidebar"
            sx={{
                backgroundColor: 'rgba(var(--joy-palette-neutral-lightChannel) / 0.50)',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                height: '100dvh',
                position: 'sticky',
                top: 0,
                width: 'var(--Sidebar-width)',
            }}
        >
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Sidebar-width': '260px',
                    },
                }}
            />
            {children}
        </Sheet>
    )
}
