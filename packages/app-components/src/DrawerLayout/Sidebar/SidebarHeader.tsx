import { Stack, Typography } from '@mui/joy'

export function SidebarHeader({ title }: React.PropsWithChildren<{ title: string }>) {
    return (
        <Stack className="Sidebar__Header" justifyContent="center" sx={{ px: 1, height: '48px' }}>
            <Typography level="h1" lineHeight={1} fontSize="20px">
                {title}
            </Typography>
        </Stack>
    )
}
