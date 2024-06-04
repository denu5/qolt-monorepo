'use server'

import { MarkerPoints } from 'domain/components/GMap'
import { fetchAndProcessAlbumImages } from 'domain/lib/lightroom-api'

export async function fetchAlbumMarkerPoints(spaceAlbumId: string): Promise<MarkerPoints> {
    const lightRoomRes = await fetchAndProcessAlbumImages(spaceAlbumId)
    const markers =
        lightRoomRes?.albumImages.flatMap((i) => {
            const { meta } = i
            if (!meta) return []

            if (!meta.location || !meta.location.latitude || !meta.location.longitude) return []
            return {
                key: i._id,
                lat: i.meta.location.latitude,
                lng: i.meta.location.longitude,
                name: i.meta.title || '',
                data: i,
            }
        }) || []

    return markers
}

export async function fetchAlbumMarkerPointsBatch(spaceAlbumIds: string[]) {
    return await Promise.all(spaceAlbumIds.map(fetchAlbumMarkerPoints))
}
