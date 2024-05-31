import {
    ComputedFields,
    DocumentTypeDef,
    FieldDefs,
    defineDocumentType,
    defineNestedType,
    makeSource,
} from 'contentlayer/source-files'

const baseFields: FieldDefs = {
    title: { type: 'string', required: true },
    desc: { type: 'string', required: false },
    tags: { type: 'json', required: false },
}

const baseComputedFields: ComputedFields = {
    slug: {
        type: 'string',
        resolve: (doc: { _raw: { flattenedPath: string } }) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
    },
}

const PageDocDef: DocumentTypeDef = {
    name: 'Page',
    filePathPattern: `p-pages/**/*.mdx`,
    contentType: 'mdx',
    fields: baseFields,
    computedFields: baseComputedFields,
}

const LocationItem = defineNestedType(() => ({
    name: 'LocationItem',
    fields: {
        lat: { type: 'number' },
        lng: { type: 'number' },
    },
}))

const MediaItem = defineNestedType(() => ({
    name: 'MediaItem',
    fields: {
        url: { type: 'string' },
        title: { type: 'string' },
        desc: { type: 'string' },
        tags: { type: 'json' },
        loc: { type: 'nested', of: LocationItem },
    },
}))

const AlbumDocDef: DocumentTypeDef = {
    name: 'Album',
    filePathPattern: `a-albums/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        ...baseFields,
        publishedAt: { type: 'string' },
        loc: { type: 'nested', of: LocationItem },
        spaceAlbumId: { type: 'string' },
        media: { type: 'list', of: MediaItem },
    },
    computedFields: baseComputedFields,
}

const VidsDocDef: DocumentTypeDef = {
    name: 'Vids',
    filePathPattern: `v-vids/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        ...baseFields,
        publishedAt: { type: 'string' },
        media: { type: 'list', of: MediaItem },
    },
    computedFields: baseComputedFields,
}

const PageType = defineDocumentType(() => PageDocDef)
const AlbumType = defineDocumentType(() => AlbumDocDef)
const VidsType = defineDocumentType(() => VidsDocDef)

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [PageType, AlbumType, VidsType],
})
