import { PageManifest } from 'app/rootManifest'

export interface PageParams {
    slug: string[]
}

export const manifest: PageManifest<PageParams> = {
    buildUrl: ({ slug }) => `/p/${slug.join('/')}`,
    metadata: {
        title: 'Article',
        description: 'Read a specific article',
    },
    isParams: (obj: unknown): obj is PageParams =>
        typeof obj === 'object' && obj !== null && 'slug' in obj && Array.isArray(obj.slug),
}
