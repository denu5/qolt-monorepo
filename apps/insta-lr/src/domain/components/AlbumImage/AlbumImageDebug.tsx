'use client'

import InfoIcon from '@mui/icons-material/InfoRounded'
import { SvgIconOwnProps } from '@mui/material'

import { useDrawer } from 'app/_components/useDrawer'

export function AlbumImageDebug({ children, iconSx }: React.PropsWithChildren<{ iconSx?: SvgIconOwnProps['sx'] }>) {
    const { openDrawer, DrawerWrapper } = useDrawer()
    return (
        <>
            <DrawerWrapper title="AlbumImage" size="lg" anchor="right" />
            <InfoIcon sx={iconSx} onClick={() => openDrawer(children)} />
        </>
    )
}
