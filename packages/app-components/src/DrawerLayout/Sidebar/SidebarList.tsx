'use client'

import { List } from '@mui/joy'

import { SidebarBody } from './SidebarBody'

export function SidebarList({ children }: React.PropsWithChildren) {
    return (
        <SidebarBody>
            <List
                className="Sidebar__List"
                size="sm"
                sx={{
                    gap: 1,
                    '--ListItem-radius': (theme) => theme.vars.radius.sm,
                }}
            >
                {children}
            </List>
        </SidebarBody>
    )
}
