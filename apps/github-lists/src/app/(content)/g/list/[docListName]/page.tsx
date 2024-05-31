import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded'
import { Box, Button, List, ListItem, Stack, Typography } from '@mui/joy'
import { HeaderCanvas } from '@qolt/app-components'
import { Mdx } from '@qolt/app-components/_client'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { getGithubList, GITHUB_LISTS_URL } from '@qolt/data-github'
import { Suspense } from 'react'

import { allGithubLists } from 'contentlayer/generated'
import { GhListRepoCount$ } from 'domain/components/GhListRepoCount'
import { GhRepoCard$ } from 'domain/components/GhRepoCard'

type PageProps = { params: { docListName: string } }

export function generateMetadata({ params: { docListName } }: PageProps) {
    return getContentMetaData(getDocBySlug(allGithubLists, docListName))
}

export default async function GhListPage({ params: { docListName } }: PageProps) {
    const doc = getDocBySlug(allGithubLists, docListName)
    const items = await getGithubList(doc.ghListName)

    return (
        <HeaderCanvas>
            <Stack
                sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--joy-palette-background-backdrop)',
                    WebkitTapHighlightColor: 'transparent',
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    zIndex: 100000,
                }}
            >
                <Box px={3} py={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography level="h1" fontSize="20px">
                            {doc.title}
                        </Typography>
                        <Button
                            size="sm"
                            component="a"
                            href={`${GITHUB_LISTS_URL}/${doc.ghListName}`}
                            target="_blank"
                            title="View list on github"
                            color="neutral"
                            variant="plain"
                            endDecorator={<OpenInNewIcon />}
                        >
                            <GhListRepoCount$ ghListName={doc.ghListName} /> Repositories
                        </Button>
                    </Stack>
                    <Typography>{doc.desc}</Typography>
                </Box>
            </Stack>
            <Mdx code={doc.body.code} />
            <List
                sx={{
                    gap: 3,
                    mx: 2,
                    my: 3,
                    alignItems: 'center',
                }}
            >
                {items.toReversed().map((item) => (
                    <ListItem key={item} sx={{ maxWidth: 640, width: '100%', p: 0 }}>
                        <Suspense>
                            <GhRepoCard$ id={item} />
                        </Suspense>
                    </ListItem>
                ))}
            </List>
        </HeaderCanvas>
    )
}
