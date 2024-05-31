import { SpaceResource, AssetResource } from 'models'

const LR_API = 'https://lightroom.adobe.com/v2'

// lightroom api bug-fix: we need to remove that while (1) {} on the first line before parsing :)
export async function parseLightroomResponse(response: Response): Promise<SpaceResource> {
    const responseText = await response.text()
    const sharedAlbumJsonString = responseText.split('\n').slice(1).join('\n')
    const sharedAlbumJson = JSON.parse(sharedAlbumJsonString) as SpaceResource

    // Check if the album ID exists before returning, otherwise throw an error
    if (!sharedAlbumJson.album || !sharedAlbumJson.album.id) {
        throw new Error('Parsed but invalid: album ID is missing.')
    }

    return sharedAlbumJson
}

/**
 * Constructs the URL for fetching the Lightroom album based on the provided space and album identifiers.
 * @param {string} space - The space identifier.
 * @param {string} album - The album identifier.
 * @returns {string} - The constructed URL for the Lightroom album.
 */
export function getLightroomAlbumUrl(space: string, album: string): string {
    return `${LR_API}/spaces/${space}/albums/${album}/assets?subtype=image;video&embed=asset`
}

/**
 * Fetches and parses the Lightroom album data for the specified space and album.
 * @param {string} space - The space identifier.
 * @param {string} album - The album identifier.
 * @param {RequestInit} [options] - Optional request initialization options.
 */
export async function fetchLightroomSpace(space: string, album: string, options?: RequestInit): Promise<SpaceResource> {
    const url = getLightroomAlbumUrl(space, album)
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return parseLightroomResponse(response)
}

export function resourceToAlbumImage(resource: AssetResource) {
    const {
        id,
        subtype,
        created,
        updated,
        payload: { develop, xmp, location, captureDate, autoTags, aesthetics },
        links,
    } = resource.asset

    type RenditionsSizes = '2048' | '1280' | '640' | 'thumbnail2x'
    const getAssetLink = (renditionSize: RenditionsSizes) => links[`/rels/rendition_type/${renditionSize}`].href

    return {
        _id: id,
        _subtype: subtype,
        _created: created,
        _updated: updated,
        _xmp: xmp,
        album: {
            order: resource.asset.payload.order ?? 0,
        },
        captureDate: captureDate,
        dimensions: {
            width: develop.croppedWidth,
            height: develop.croppedHeight,
            orientation: develop.userOrientation,
            aspectRatio: calcAspectRatio(develop.croppedWidth, develop.croppedHeight),
        },
        renditions: {
            xs: getAssetLink('thumbnail2x'),
            sm: getAssetLink('640'),
            md: getAssetLink('1280'),
            xl: getAssetLink('2048'),
        },
        meta: {
            title: xmp.dc?.title,
            description: xmp.dc?.description,
            rights: xmp.dc?.rights,
            camera: {
                lens: xmp.aux?.Lens,
                make: xmp.tiff?.Make,
                model: xmp.tiff?.Model,
                orientation: xmp.tiff?.Orientation,
            },
            exif: xmp.exif,
            location: location,
            tags: xmp.dc?.subject ? Object.keys(xmp.dc.subject) : [],
            _autoTags: Object.keys(autoTags.tags),
            _aesthetics: aesthetics,
        },
    }
}

// Utils
function calcAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

    const divisor: number = gcd(width, height)
    const reducedWidth: number = width / divisor
    const reducedHeight: number = height / divisor

    return `${String(reducedWidth)}/${String(reducedHeight)}`
}
