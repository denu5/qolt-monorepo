import { ComputedFields, DocumentTypeDef, FieldDefs, defineDocumentType, makeSource } from 'contentlayer/source-files'

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

const PageType = defineDocumentType(() => PageDocDef)

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [PageType],
})
