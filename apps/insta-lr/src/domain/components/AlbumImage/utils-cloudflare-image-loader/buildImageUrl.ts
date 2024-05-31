/**
 * Generates a URL for Cloudflare image transformations.
 *
 * @param src - The source image URL or path.
 * @param options - The transformation options.
 * @returns The transformed image URL.
 */
export function buildImageUrl(src: string, options: CloudflareImageOptions): string {
    const params = []

    if (options.width) params.push(`width=${options.width}`)
    if (options.height) params.push(`height=${options.height}`)
    if (options.quality) params.push(`quality=${options.quality}`)
    if (options.fit) params.push(`fit=${options.fit}`)
    if (options.format) params.push(`format=${options.format}`)
    if (options.gravity) params.push(`gravity=${options.gravity}`)
    if (options.dpr) params.push(`dpr=${options.dpr}`)
    if (options.sharpen) params.push(`sharpen=${options.sharpen}`)
    // Add more options handling as needed

    const optionsString = params.join(',')
    return `/cdn-cgi/image/${optionsString}/${normalizeSrc(src)}`
}

/**
 * Normalizes the source URL by removing the leading slash if present.
 *
 * @param src - The source image URL or path.
 * @returns The normalized source path.
 */
function normalizeSrc(src: string): string {
    return src.startsWith('/') ? src.slice(1) : src
}

/**
 * Options for Cloudflare image transformations.
 */
export type CloudflareImageOptions = {
    /**
     * Specifies the maximum width of the image in pixels.
     */
    width?: number

    /**
     * Specifies the maximum height of the image in pixels.
     */
    height?: number

    /**
     * Specifies the quality for images in JPEG, WebP, and AVIF formats.
     * The quality is on a 1-100 scale, but useful values are between 50 (low quality, small file size)
     * and 90 (high quality, large file size). 85 is the default.
     */
    quality?: number

    /**
     * Device Pixel Ratio. Default is 1. Multiplier for width/height that makes it easier
     * to specify higher-DPI sizes in `<img srcset>`.
     */
    dpr?: number

    /**
     * Affects interpretation of width and height. All resizing modes preserve aspect ratio.
     * Available modes are: 'scale-down', 'contain', 'cover', 'crop', 'pad'.
     */
    fit?: Fit

    /**
     * The format of the output image. 'auto' will serve the WebP or AVIF format to browsers that support it.
     * Other options include 'avif', 'webp', 'jpeg', 'baseline-jpeg', 'json'.
     */
    format?: Format

    /**
     * Whether to preserve animation frames from input files. Default is true.
     * Setting it to false reduces animations to still images.
     */
    anim?: boolean

    /**
     * Background color to add underneath the image. Applies to images with transparency
     * (for example, PNG) and images resized with fit=pad. Accepts any CSS color, such as #RRGGBB and rgba(…).
     */
    background?: Background

    /**
     * Blur radius between 1 (slight blur) and 250 (maximum).
     */
    blur?: number

    /**
     * Adds a border around the image. The border is added after resizing.
     * Border width takes dpr into account, and can be specified either using a single width property,
     * or individually for each side.
     */
    border?: Border

    /**
     * Increase brightness by a factor. A value of 1.0 equals no change,
     * a value of 0.5 equals half brightness, and a value of 2.0 equals twice as bright. 0 is ignored.
     */
    brightness?: number

    /**
     * Slightly reduces latency on a cache miss by selecting a quickest-to-compress file format,
     * at a cost of increased file size and lower image quality.
     */
    compression?: Compression

    /**
     * Increase contrast by a factor. A value of 1.0 equals no change,
     * a value of 0.5 equals low contrast, and a value of 2.0 equals high contrast. 0 is ignored.
     */
    contrast?: number

    /**
     * Increase exposure by a factor. A value of 1.0 equals no change,
     * a value of 0.5 darkens the image, and a value of 2.0 lightens the image. 0 is ignored.
     */
    gamma?: number

    /**
     * When cropping with fit: "cover" and fit: "crop", this parameter defines the side or point
     * that should not be cropped. Available options are 'auto', 'left', 'right', 'top', 'bottom',
     * or a specific point as `${number}x${number}`.
     */
    gravity?: Gravity

    /**
     * Controls the amount of invisible metadata (EXIF data) that should be preserved.
     * Options are 'keep', 'copyright', 'none'.
     */
    metadata?: Metadata

    /**
     * In case of a fatal error that prevents the image from being resized, redirects to the unresized
     * source image URL. This option is ignored if the image is from another domain.
     */
    onerror?: 'redirect'

    /**
     * Number of degrees (90, 180, or 270) to rotate the image by. `width` and `height` options
     * refer to axes after rotation.
     */
    rotate?: 90 | 180 | 270

    /**
     * Specifies strength of sharpening filter to apply to the image. The value is a floating-point
     * number between 0 (no sharpening, default) and 10 (maximum).
     */
    sharpen?: number

    /**
     * Specifies a number of pixels to cut off on each side. Allows removal of borders or cutting
     * out a specific fragment of an image. Trimming is performed before resizing or rotation.
     */
    trim?: string // "top;right;bottom;left" or individual properties as "trim.width", "trim.height", etc.
}

/**
 * Type definitions for various simple option strings used in `CloudflareImageOptions`.
 */
type Gravity = 'auto' | 'left' | 'right' | 'top' | 'bottom' | `${number}x${number}`
type Fit = 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
type Format = 'auto' | 'avif' | 'webp' | 'jpeg' | 'baseline-jpeg' | 'json'
type Metadata = 'keep' | 'copyright' | 'none'
type Compression = 'fast'
type Background = string // CSS color
type Border = {
    color: string
    top?: number
    right?: number
    bottom?: number
    left?: number
    width?: number
}
