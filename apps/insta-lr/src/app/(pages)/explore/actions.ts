'use server'

import { MarkerPoints } from 'domain/components/GMap'
import { fetchAndProcessAlbumImages } from 'domain/lib/lightroom-api'

export async function fetchAlbumMarkerPoints(spaceAlbumId: string): Promise<MarkerPoints> {
    const lightRoomRes = await fetchAndProcessAlbumImages(spaceAlbumId)
    const markers =
        lightRoomRes?.albumImages.flatMap((img) => {
            const { meta } = img
            if (!meta) return []

            if (!meta.location || !meta.location.latitude || !meta.location.longitude) return []
            return {
                key: img._id,
                lat: img.meta.location.latitude,
                lng: img.meta.location.longitude,
                name: img.meta.title || '',
                data: {
                    img,
                    spaceAlbumId,
                    baseUrl: lightRoomRes.baseUrl,
                },
            }
        }) || []

    return markers
}

export async function fetchAlbumMarkerPointsBatch(spaceAlbumIds: string[]) {
    return await Promise.all(spaceAlbumIds.map(fetchAlbumMarkerPoints))
}
