import { ComputedFields, DocumentTypeDef, FieldDefs, defineDocumentType, makeSource } from 'contentlayer/source-files'
import mdxMermaid from 'mdx-mermaid'

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

const ArticleDocDef: DocumentTypeDef = {
    name: 'Article',
    filePathPattern: `a-articles/**/*.mdx`,
    contentType: 'mdx',
    fields: baseFields,
    computedFields: baseComputedFields,
}

const GithubListDocDef: DocumentTypeDef = {
    name: 'GithubList',
    filePathPattern: `g-github-lists/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        ...baseFields,
        ghListName: { type: 'string', required: true },
    },
    computedFields: baseComputedFields,
}

const Page = defineDocumentType(() => PageDocDef)
const Article = defineDocumentType(() => ArticleDocDef)
const GithubList = defineDocumentType(() => GithubListDocDef)

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Page, Article, GithubList],
    mdx: {
        remarkPlugins: [[mdxMermaid, { output: 'svg' }]],
    },
})

