export type SpaceResource = {
    base: string
    album: Album
    resources: AssetResource[]
}

export type Album = {
    id: string
    links: {
        self: string
    }
}

export type AssetResource = {
    id: string
    type: 'album_asset'
    asset: Asset
    created: string
    updated: string
    revision_ids: string[]
    links: ResourceLinks
    payload: unknown // Define more specifically if needed
}

export type ResourceLinks = {
    self: Link
    [key: string]: Link | undefined // To accommodate all links, including rendition types
}

export type Asset = {
    id: string
    type: string
    subtype: string
    created: string
    updated: string
    revision_ids: string[]
    links: AssetLinks
    payload: AssetPayload
}

export type AssetLinks = {
    self: Link
    '/rels/comments': CommentLink
    '/rels/favorites': FavoriteLink
    '/rels/rendition_type/2048': Link
    '/rels/rendition_type/1280': Link
    '/rels/rendition_type/640': Link
    '/rels/rendition_type/thumbnail2x': Link
    '/rels/rendition_generate/fullsize': TemplatedLink
    '/rels/profiles/camera': CameraProfileLink
    [key: string]: Link | CommentLink | FavoriteLink | TemplatedLink | CameraProfileLink
}

type Link = {
    href: string
    count?: number // Some links might have a count property
    templated?: boolean // Some links might be templates
}

type CommentLink = {
    count: number
} & Link

type FavoriteLink = {
    count: number
} & Link

type TemplatedLink = {
    templated: boolean
} & Link

type CameraProfileLink = {
    filename: string
} & Link

type AssetPayload = {
    develop: Develop
    userUpdated: string
    captureDate: string
    xmp: Partial<Xmp>
    importSource: ImportSource
    userCreated: string
    aesthetics: Aesthetics
    autoTags: AutoTags
    location: AssetLocation
    order?: string
}

type AssetLocation = {
    longitude: number
    latitude: number
    altitude: number
    direction: number
    reference: 'T'
    city: string
    country: string
    isoCountryCode: string
    state: string
    sublocation: string[]
}

type Develop = {
    processingModel: string
    croppedHeight: number
    xmpCameraRaw: string
    userOrientation: number
    croppedWidth: number
    crsVersion: string
    profiles: Profiles
    userUpdated: string
    crsHDREditMode: boolean
    device: string
}

type Profiles = {
    camera: Camera
}

type Camera = {
    filename: string
    href: string
}

type Xmp = {
    tiff?: Tiff
    exif?: Exif
    aux?: Aux
    xmp?: XmpSub
    photoshop?: Photoshop
    dc?: XmpDesc
}

type Tiff = {
    Orientation: string
    Make: string
    Model: string
}

type Exif = {
    ApertureValue: number[]
    FNumber: number[]
    MaxApertureValue: number[]
    FocalLength: number[]
    LightSource: string
    DateTimeOriginal: string
    FlashRedEyeMode: boolean
    ExposureTime: number[]
    FlashFired: boolean
    MeteringMode: string
    FocalLengthIn35mmFilm: number
    ExposureProgram: string
    FlashReturn: string
    ISOSpeedRatings: number
    ShutterSpeedValue: number[]
    FlashMode: string
    BrightnessValue: number[]
    FlashFunction: boolean
    ExposureBiasValue: number[]
}

type Aux = {
    Lens: string
}

type XmpSub = {
    CreatorTool: string
    CreateDate: string
    ModifyDate: string
}

type Photoshop = {
    DateCreated: string
}

type XmpDesc = {
    subject?: Record<string, boolean>
    title?: string
    description?: string
    rights?: string
}

type ImportSource = {
    originalHeight: number
    importedOnDevice: string
    importTimestamp: string
    contentType: string
    sha256: string
    fileSize: number
    importedBy: string
    fileName: string
    originalWidth: number
}

type Aesthetics = {
    application: string
    version: number
    created: string
    score: number
    balancing: number
    harmony: number
    content: number
    dof: number
    lighting: number
    emphasis: number
    repetition: number
    rot: number
    symmetry: number
    vivid: number
}

type AutoTags = {
    tags: Record<string, number>
    application: string
    version: number
    created: string
}
