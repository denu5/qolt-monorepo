'use client'

import Button from '@mui/joy/Button'
import DialogContent from '@mui/joy/DialogContent'
import DialogTitle from '@mui/joy/DialogTitle'
import Divider from '@mui/joy/Divider'
import Drawer from '@mui/joy/Drawer'
import ModalClose from '@mui/joy/ModalClose'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import { useState, useCallback } from 'react'

export function useDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState<React.ReactNode>()

    const openDrawer = useCallback((component: React.ReactNode) => {
        setContent(component)
        setIsOpen(true)
    }, [])

    const closeDrawer = useCallback(() => {
        setIsOpen(false)
        setContent(<></>)
    }, [])

    const DrawerWrapper = ({
        anchor = 'left',
        title,
        size,
        variant,
    }: Partial<React.ComponentPropsWithoutRef<typeof Drawer>>) => (
        <Drawer
            size={size}
            open={isOpen}
            anchor={anchor}
            onClose={() => closeDrawer()}
            variant={variant}
            slotProps={{
                content: {
                    sx: {
                        bgcolor: 'transparent',
                        p: { md: 3, sm: 0 },
                        boxShadow: 'none',
                    },
                },
            }}
        >
            <Sheet
                sx={{
                    borderRadius: 'md',
                    p: 2,
                    ml: 'var(--LeftRail-width)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                <DialogTitle>{title}</DialogTitle>
                <ModalClose />
                <Divider sx={{ mt: 'auto' }} />
                <DialogContent sx={{ gap: 2 }}>{content}</DialogContent>
                <Divider sx={{ mt: 'auto' }} />
                <Stack direction="row" justifyContent="space-between" useFlexGap spacing={1}>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </Stack>
            </Sheet>
        </Drawer>
    )

    return { openDrawer, closeDrawer, DrawerWrapper }
}
