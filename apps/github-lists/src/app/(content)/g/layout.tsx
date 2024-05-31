import { ListItem, ListItemContent, Stack, Typography } from '@mui/joy'
import { Sidebar } from '@qolt/app-components'
import { SidebarList, SidebarListButton, SidebarHeader } from '@qolt/app-components/_client'
import { getDocBySlug } from '@qolt/app-contentlayer'

import { allGithubLists, allPages } from 'contentlayer/generated'
import { GhListRepoCount$ } from 'domain/components/GhListRepoCount'

export default function DrawerLayout({ children }: React.PropsWithChildren) {
    const doc = getDocBySlug(allPages, 'github-lists')

    return (
        <>
            <Sidebar>
                <Stack
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'var(--joy-palette-background-backdrop)',
                        WebkitTapHighlightColor: 'transparent',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        zIndex: 1100,
                    }}
                >
                    <SidebarHeader title={doc.title} />
                </Stack>
                <SidebarList>
                    {allGithubLists.map((item) => (
                        <ListItem key={item.slug}>
                            <SidebarListButton href={`/g/list/${item.slug}`}>
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
