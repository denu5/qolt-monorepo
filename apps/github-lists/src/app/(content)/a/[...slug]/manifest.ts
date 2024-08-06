import { PageManifest } from 'app/rootManifest'

export interface ArticleParams {
    slug: string[]
}

export const manifest: PageManifest<ArticleParams> = {
    buildUrl: ({ slug }) => `/a/${slug.join('/')}`,
    metadata: {
        title: 'Article',
        description: 'Read a specific article',
    },
    isParams: (obj: unknown): obj is ArticleParams =>
        typeof obj === 'object' && obj !== null && 'slug' in obj && Array.isArray(obj.slug),
}
