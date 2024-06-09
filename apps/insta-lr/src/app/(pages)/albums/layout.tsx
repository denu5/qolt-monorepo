import { ListItem, ListItemContent } from '@mui/joy'
import { DrawerLayout } from '@qolt/app-components'
import { Sidebar, SidebarList, SidebarListButton } from '@qolt/app-components/_client'
import { getDocBySlug } from '@qolt/app-contentlayer'

import { allPages, allAlbums } from 'contentlayer/generated'

export default function Layout({ children }: React.PropsWithChildren) {
    const doc = getDocBySlug(allPages, 'albums')

    return (
        <>
            <Sidebar>
                <DrawerLayout.TopRail>
                    <DrawerLayout.TopRailTitle title={doc.title} />
                </DrawerLayout.TopRail>
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
