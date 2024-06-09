import { List, ListItem } from '@mui/joy'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { notFound } from 'next/navigation'

import { allAlbums } from 'contentlayer/generated'
import { AlbumImageCard } from 'domain/components/AlbumImage'
import React from 'react'
import { fetchAndProcessAlbumImages } from 'domain/lib/lightroom-api'
import { DrawerLayout as DLayout } from '@qolt/app-components'

type PageProps = {
    params: {
        slug: string[]
    }
}

export function generateMetadata({ params }: PageProps) {
    return getContentMetaData(getDocBySlug(allAlbums, params.slug.join('/')))
}

export default async function Page({ params }: PageProps) {
    try {
        const doc = getDocBySlug(allAlbums, params.slug.join('/'))
        if (!doc.spaceAlbumId) return 'missing id in doc'

        const lightRoomRes = await fetchAndProcessAlbumImages(doc.spaceAlbumId)
        if (!lightRoomRes) return notFound()

        const imgs = lightRoomRes.albumImages.toSorted((a, b) =>
            String(a.album.order).localeCompare(String(b.album.order)),
        )

        return (
            <DLayout.Children>
                <DLayout.TopRail>
                    <DLayout.TopRailTitle title={doc.title} />
                </DLayout.TopRail>
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
            </DLayout.Children>
        )
    } catch (e) {
        console.log(e)
        return notFound()
    }
}
