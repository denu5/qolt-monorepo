import { ImageLoaderProps } from 'next/image'

import { CloudflareImageOptions, buildImageUrl } from './buildImageUrl'

const ZONE_URL = process.env.NEXT_PUBLIC_CFIMG_ZONE ?? ''

export const IS_CFLOADER_ACTIVE = Boolean(ZONE_URL)

type CloudflareImageLoaderProps = {
    quality?: number
    // Extend with any other Cloudflare specific options
    fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
    format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'baseline-jpeg' | 'json'
    gravity?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | `${number}x${number}`
    dpr?: number
    sharpen?: number
} & ImageLoaderProps

/**
 * A loader function for Next.js Image component to integrate with Cloudflare Image transformations.
 *
 * @param loaderProps - The loader properties including src, width, quality, and other Cloudflare specific options.
 * @returns The URL for the transformed image.
 */
export function cloudflareImageLoader(props: CloudflareImageLoaderProps): string {
    const { src, width, quality, fit, format, gravity, dpr, sharpen } = props

    // Construct the options object for Cloudflare image transformations
    const options: CloudflareImageOptions = {
        width,
        quality,
        fit,
        format,
        gravity,
        dpr,
        sharpen,
    }

    return `${ZONE_URL}${buildImageUrl(src, options)}`
}
