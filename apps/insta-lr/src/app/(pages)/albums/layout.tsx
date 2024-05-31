import { ListItem, ListItemContent } from '@mui/joy'
import { Sidebar } from '@qolt/app-components'
import { SidebarList, SidebarHeader, SidebarListButton } from '@qolt/app-components/_client'
import { getDocBySlug } from '@qolt/app-contentlayer'

import { allPages, allAlbums } from 'contentlayer/generated'

export default function DrawerLayout({ children }: React.PropsWithChildren) {
    const doc = getDocBySlug(allPages, 'albums')

    return (
        <>
            <Sidebar>
                <SidebarHeader title={doc.title} />
                <SidebarList>
                    {allAlbums.map((album) => (
                        <ListItem key={album.slug}>
                            <SidebarListButton href={`/albums/${album.slug}`}>
                                <ListItemContent>{album.title}</ListItemContent>
                            </SidebarListButton>
                        </ListItem>
                    ))}
                </SidebarList>
            </Sidebar>
            {children}
        </>
    )
}

export const revalidate = 43200
