import { resourceToAlbumImage, getLightroomAlbumUrl, parseLightroomResponse } from '@qolt/data-lightroom'

type AlbumAttributes = {
    id: string
    created: string
    updated: string
    payload: {
        name: string
        userUpdated: string
        userCreated: string
        assetSortOrder: string
    }
    cover: {
        id: string
    }
}

export type SharesConfig = {
    spaceAttributes?: {
        base: string
        id: string
    }
    albumAttributes?: AlbumAttributes
}

export function getSharesConfig(obj: any): SharesConfig {
    const sharesConfig: SharesConfig = {}

    if (obj.spaceAttributes) {
        sharesConfig.spaceAttributes = {
            base: obj.spaceAttributes.base,
            id: obj.spaceAttributes.id,
        }
    }

    if (obj.albumAttributes) {
        sharesConfig.albumAttributes = {
            id: obj.albumAttributes.id,
            created: obj.albumAttributes.created,
            updated: obj.albumAttributes.updated,
            payload: {
                name: obj.albumAttributes.payload.name,
                userUpdated: obj.albumAttributes.payload.userUpdated,
                userCreated: obj.albumAttributes.payload.userCreated,
                assetSortOrder: obj.albumAttributes.payload.assetSortOrder,
            },
            cover: {
                id: obj.albumAttributes?.cover?.id,
            },
        }
    }

    return sharesConfig
}

export async function fetchAndProcessAlbumImages(spaceAlbumId: string) {
    const [space, album] = spaceAlbumId.split('.')

    try {
        const { resources, base } = await fetchLightroomAlbum(space, album)
        const albumImages = resources.map(resourceToAlbumImage)
        return {
            albumImages,
            baseUrl: base,
        }
    } catch (error) {
        console.error('Failed to fetch Lightroom album:', error)
    }
}

export async function fetchLightroomAlbum(space: string, album: string) {
    const url = getLightroomAlbumUrl(space, album)
    const response = await fetch(url, {
        next: { revalidate: Infinity, tags: ['lightroom-album'] },
    })
    return parseLightroomResponse(response)
}
