import { Box, List, ListItem, Stack, Typography } from '@mui/joy'
import { HeaderCanvas } from '@qolt/app-components'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

import { allAlbums } from 'contentlayer/generated'
import { AlbumImageCard } from 'domain/components/AlbumImage'
import React from 'react'
import { fetchAndProcessAlbumImages } from 'domain/lib/lightroom-api'

type PageProps = {
    params: {
        slug: string[]
    }
}

export function generateMetadata({ params }: PageProps) {
    return getContentMetaData(getDocBySlug(allAlbums, params.slug.join('/')))
}

export default async function DrawerLayoutPage({ params }: PageProps) {
    try {
        const doc = getDocBySlug(allAlbums, params.slug.join('/'))
        if (!doc.spaceAlbumId) return 'missing id'

        const lightRoomRes = await fetchAndProcessAlbumImages(doc.spaceAlbumId)
        if (!lightRoomRes) return notFound()

        const imgs = lightRoomRes.albumImages.toSorted((a, b) =>
            String(a.album.order).localeCompare(String(b.album.order)),
        )

        return (
            <HeaderCanvas>
                <Stack
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'rgba(var(--joy-palette-neutral-lightChannel) / 0.50)',
                        WebkitTapHighlightColor: 'transparent',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        zIndex: 1100,
                    }}
                >
                    <Box px={3} py={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography level="h1" fontSize="20px">
                                {doc.title} {doc.publishedAt && format(new Date(doc.publishedAt), 'MMMM dd, yyyy')}
                            </Typography>
                        </Stack>
                        <Typography>{doc.desc}</Typography>
                    </Box>
                </Stack>
                <List
                    sx={{
                        gap: 3,
                        mx: 2,
                        my: 3,
                        alignItems: 'center',
                    }}
                >
                    {imgs.map((img) => (
                        <ListItem key={img._id} sx={{ maxWidth: 720, width: '100%', p: 0 }}>
                            <AlbumImageCard key={img._id} img={img} baseUrl={lightRoomRes.baseUrl} />
                        </ListItem>
                    ))}
                </List>
            </HeaderCanvas>
        )
    } catch (e) {
        console.log(e)
        return notFound()
    }
}
