'use client'

import { ListItemButton } from '@mui/joy'
import { usePathname } from 'next/navigation'

import { NLink } from 'NLink'

export function SidebarListButton({ href, children }: React.PropsWithChildren<{ href: string }>) {
    const pathname = usePathname()
    return (
        <ListItemButton component={NLink} href={href} selected={pathname.endsWith(href)}>
            {children}
        </ListItemButton>
    )
}
