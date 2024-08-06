import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded'
import { Button, List, ListItem, Stack } from '@mui/joy'
import { DrawerLayout } from '@qolt/app-components'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { Suspense } from 'react'

import { allGithubLists } from 'contentlayer/generated'
import { GhListRepoCount$ } from 'domain/components/GhListRepoCount'
import { getOwnGithubList, getOwnGithubListsHtmlUrl } from 'domain/utils/githubListsUtils'
import { getGhPackageURL } from '@qolt/data-github'
import { GhPURLCard$ } from 'domain/components/GhPURLCard'
import { PageProps } from 'app/rootManifest'
import { GhListParams } from './manifest'

export function generateMetadata({ params: { docListName } }: PageProps<GhListParams>) {
    return getContentMetaData(getDocBySlug(allGithubLists, docListName))
}

export default async function GhListPage({ params: { docListName } }: PageProps<GhListParams>) {
    const doc = getDocBySlug(allGithubLists, docListName)
    const items = await getOwnGithubList(doc.ghListName)

    return (
        <DrawerLayout.Children>
            <DrawerLayout.TopRail>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <DrawerLayout.TopRailTitle title={doc.title} />
                    <Button
                        size="sm"
                        component="a"
                        href={getOwnGithubListsHtmlUrl(doc.ghListName)}
                        target="_blank"
                        title="View list on github"
                        color="neutral"
                        variant="plain"
                        endDecorator={<OpenInNewIcon />}
                    >
                        <GhListRepoCount$ ghListName={doc.ghListName} /> Repositories
                    </Button>
                </Stack>
            </DrawerLayout.TopRail>

            {/* <Typography>{doc.desc}</Typography>
            <Mdx code={doc.body.code} /> */}
            <List
                sx={{
                    gap: 3,
                    mx: 2,
                    my: 3,
                    alignItems: 'center',
                }}
            >
                {items.toReversed().map((item) => (
                    <ListItem key={item} sx={{ maxWidth: 720, width: '100%', p: 0 }}>
                        <Suspense>
                            <GhPURLCard$ purl={getGhPackageURL(item)} />
                        </Suspense>
                    </ListItem>
                ))}
            </List>
        </DrawerLayout.Children>
    )
}
