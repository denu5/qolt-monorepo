import { Sheet } from '@mui/joy'

export function HeaderCanvas({ children }: React.PropsWithChildren) {
    return (
        <Sheet
            sx={{
                backgroundColor: 'background.level',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                flex: 1,
            }}
        >
            {children}
        </Sheet>
    )
}
