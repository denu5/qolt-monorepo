import { PageManifest } from 'app/rootManifest'

export interface RepoParams {
    slug: string
}

export const manifest: PageManifest<RepoParams> = {
    buildUrl: ({ slug }) => `/purl/${slug}`,
    metadata: {
        title: 'Repository Details',
        description: 'View details of a specific repository',
    },
    isParams: (obj: unknown): obj is RepoParams =>
        typeof obj === 'object' && obj !== null && 'slug' in obj && typeof obj.slug === 'string',
}
