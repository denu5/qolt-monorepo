import { ComputedFields, DocumentTypeDef, FieldDefs } from 'contentlayer/source-files'
import { Metadata } from 'next'

// Base Page with fields
export type BaseDoc = {
    /** File path relative to `contentDirPath` */
    _id: string
    /** baseFields */
    type: string
    title: string
    desc?: string
    /** computedFields */
    slug: string
}

export const baseFields: FieldDefs = {
    title: { type: 'string', required: true },
    desc: { type: 'string', required: false },
    tags: { type: 'json', required: false },
}

export const baseComputedFields: ComputedFields = {
    slug: {
        type: 'string',
        resolve: (doc: { _raw: { flattenedPath: string } }) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
    },
}

export const PageDocDef: DocumentTypeDef = {
    name: 'Page',
    filePathPattern: `p-pages/**/*.mdx`,
    contentType: 'mdx',
    fields: baseFields,
    computedFields: baseComputedFields,
}

// Utils
export function getDocBySlug<T extends BaseDoc>(allDocs: T[], slug: string): T {
    if (!allDocs.length) throw new Error('Emtpy allDocs passed to getDocBySlug')
    const doc = allDocs.find((c) => c.slug === slug)
    if (!doc) throw new Error(`No document found for slug ${slug}`)
    return doc
}

export function getContentMetaData(c: BaseDoc): Metadata {
    return {
        title: c.title,
        description: c.desc,
    }
}
