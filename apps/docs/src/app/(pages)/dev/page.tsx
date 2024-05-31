'use client'
import { Stack } from '@mui/joy'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Divider from '@mui/joy/Divider'
import { SxProps } from '@mui/joy/styles/types'
import Typography from '@mui/joy/Typography'

import { TypographyThemeViewer } from './TypographyThemeViewer'

function SectionCard({ title, sx, children }: React.PropsWithChildren<{ title: string; sx?: SxProps }>) {
    return (
        <Card
            variant="outlined"
            sx={{
                maxHeight: 'max-content',
                maxWidth: '100%',
                // to make the demo resizable
                overflow: 'auto',
                resize: 'horizontal',
                ...sx,
            }}
        >
            <Typography level="title-lg">{title}</Typography>
            <Divider inset="none" />
            <CardContent>{children}</CardContent>
        </Card>
    )
}

export default function Page() {
    return (
        <Stack gap={4} p={4} justifyContent="stretch">
            <SectionCard title="Typography Config">
                <TypographyThemeViewer />
            </SectionCard>
            <SectionCard title="MUI Icons">{/* https://mui.com/material-ui/material-icons/ */}</SectionCard>
        </Stack>
    )
}
