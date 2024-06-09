import { Sheet, Stack, Typography } from '@mui/joy'

export function Layout({ children }: React.PropsWithChildren) {
    return <>{children}</>
}

export function Children({ children }: React.PropsWithChildren) {
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

export function TopRail({ children, title }: React.PropsWithChildren<{ title?: string }>) {
    return (
        <Stack
            sx={{
                position: 'sticky',
                top: 0,
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1100,
                height: '48px',
            }}
        >
            <Stack direction="row">
                {title && <TopRailTitle title={title} />}
                {children}
            </Stack>
        </Stack>
    )
}

export function TopRailTitle({ title }: React.PropsWithChildren<{ title: string }>) {
    return (
        <Stack className="TopRail__Title" justifyContent="center" sx={{ px: 1, height: '48px' }}>
            <Typography level="title-lg" lineHeight={1}>
                {title}
            </Typography>
        </Stack>
    )
}
