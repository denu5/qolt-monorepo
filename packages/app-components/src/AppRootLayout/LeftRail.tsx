import { Sheet } from '@mui/joy'

export function LeftRail({ children }: React.PropsWithChildren) {
    return (
        <Sheet
            className="LeftRail"
            sx={{
                position: 'fixed',
                transition: 'transform 0.4s',
                zIndex: 100,
                height: '100dvh',
                width: 'var(--LeftRail-width)',
                top: 0,
                p: 1.5,
                py: 1,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                borderRight: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(var(--joy-palette-neutral-lightChannel) / 0.50)',
            }}
        >
            {children}
        </Sheet>
    )
}
