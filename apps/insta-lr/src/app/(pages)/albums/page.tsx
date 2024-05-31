'use client'
import { Box, Button } from '@mui/joy'

import { useDrawer } from 'app/_components/useDrawer'

export default function Page() {
    const { openDrawer, DrawerWrapper } = useDrawer()
    return (
        <Box>
            <DrawerWrapper title="Test" />
            <Button onClick={() => openDrawer(<>hallo</>)}>open</Button>
        </Box>
    )
}
