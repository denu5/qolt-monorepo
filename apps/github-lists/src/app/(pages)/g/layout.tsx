import { ListItem, ListItemContent, Typography } from '@mui/joy'
import { SidebarList, SidebarListButton, SidebarHeader, Sidebar } from '@qolt/app-components/_client'
import { getDocBySlug } from '@qolt/app-contentlayer'

import { allGithubLists, allPages } from 'contentlayer/generated'
import { GhListRepoCount$ } from 'domain/components/GhListRepoCount'

export default function DrawerLayout({ children }: React.PropsWithChildren) {
    const doc = getDocBySlug(allPages, 'github-lists')

    return (
        <>
            <Sidebar>
                <SidebarHeader title={doc.title} />
                <SidebarList>
                    {allGithubLists.map((item) => (
                        <ListItem key={item.slug}>
                            <SidebarListButton href={`/g/lists/${item.slug}`}>
                                <ListItemContent>{item.title}</ListItemContent>
                                <Typography level="body-sm" sx={{ fontWeight: 'bold', color: 'inherit' }}>
                                    <GhListRepoCount$ ghListName={item.ghListName} />
                                </Typography>
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
