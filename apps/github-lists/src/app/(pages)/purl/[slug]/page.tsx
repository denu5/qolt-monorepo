import { List, ListItem, Stack, Chip, Typography, Card, CardContent } from '@mui/joy'
import { DrawerLayout as DLayout } from '@qolt/app-components'
import { notFound } from 'next/navigation'

import { Suspense } from 'react'
import { RepoMetadataService } from 'domain/services/repoMetadataService'
import { createPURLFromSlug } from 'domain/utils/repoIdConverter'
import { NpmPURLCard$ } from 'domain/components/NpmPURLCard'
import { GhPURLCard$ } from 'domain/components/GhPURLCard'
import { PageProps } from 'app/rootManifest'
import { RepoParams } from './manifest'

export default async function Page({ params }: PageProps<RepoParams>) {
    try {
        const slug = decodeURIComponent(params.slug)
        const purl = createPURLFromSlug(slug)

        const repoMetadataService = await RepoMetadataService.init()
        const repo = await repoMetadataService.getRepoMetadata(slug)

        if (!repo?.source) return notFound()

        return (
            <DLayout.Children>
                <DLayout.TopRail>
                    <DLayout.TopRailTitle title={`${repo.source.namespace}/${repo.source.name}`} />
                </DLayout.TopRail>
                <List
                    sx={{
                        gap: 3,
                        mx: 2,
                        my: 3,
                        alignItems: 'stretch',
                    }}
                >
                    <ListItem>
                        <Suspense fallback={<div>Loading repository card...</div>}>
                            <GhPURLCard$ purl={purl!} />
                        </Suspense>
                    </ListItem>
                    <ListItem>
                        <Suspense fallback={<div>Loading repository card...</div>}>
                            {repo.registry && <NpmPURLCard$ purl={repo.registry} githubPurl={purl} />}
                        </Suspense>
                    </ListItem>
                    <ListItem>
                        <Card variant="outlined" sx={{ width: '100%' }}>
                            <CardContent>
                                <Typography level="h3">Repository Details</Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
                                    <Chip size="sm">Type: {repo.atomicType}</Chip>
                                    <Chip size="sm">Language: {repo.language}</Chip>
                                    {repo.tags.map((tag) => (
                                        <Chip key={tag} size="sm">
                                            {tag}
                                        </Chip>
                                    ))}
                                </Stack>
                                <Typography>Created: {new Date(repo.createdAt).toLocaleString()}</Typography>
                                <Typography>Updated: {new Date(repo.updatedAt).toLocaleString()}</Typography>
                            </CardContent>
                        </Card>
                    </ListItem>
                    <ListItem>
                        <Card variant="outlined" sx={{ width: '100%' }}>
                            <CardContent>
                                <Typography>Languages</Typography>
                                <List>
                                    {Object.entries(repo.languages || {}).map(([lang, bytes]) => (
                                        <ListItem key={lang}>
                                            <Typography>
                                                {lang}: {bytes} bytes
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </ListItem>
                    {purl && (
                        <ListItem>
                            <Card variant="outlined" sx={{ width: '100%' }}>
                                <CardContent>
                                    <Typography>Package URL</Typography>
                                    <Typography>{purl.toString()}</Typography>
                                </CardContent>
                            </Card>
                        </ListItem>
                    )}
                </List>
            </DLayout.Children>
        )
    } catch (e) {
        console.error(e)
        return notFound()
    }
}
