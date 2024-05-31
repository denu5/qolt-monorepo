import { ListItem, ListItemContent, Stack } from '@mui/joy'
import { Sidebar } from '@qolt/app-components'
import { SidebarList, SidebarHeader, SidebarListButton } from '@qolt/app-components/_client'

import { allVids } from 'contentlayer/generated'

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <Stack direction="row" flex={1}>
            <Sidebar>
                <SidebarHeader title="Youtube Collections" />
                <SidebarList>
                    {allVids.map((v) => (
                        <ListItem key={v.slug}>
                            <SidebarListButton href={`/vids/${v.slug}`}>
                                <ListItemContent>{v.title}</ListItemContent>
                            </SidebarListButton>
                        </ListItem>
                    ))}
                </SidebarList>
            </Sidebar>
            {children}
        </Stack>
    )
}

export const revalidate = 43200
