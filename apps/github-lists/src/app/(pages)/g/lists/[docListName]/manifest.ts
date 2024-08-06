import { PageManifest } from 'app/rootManifest'

export interface GhListParams {
    docListName: string
}

export const manifest: PageManifest<GhListParams> = {
    buildUrl: ({ docListName }) => `/g/lists/${docListName}`,
    metadata: {
        title: 'Repository Details',
        description: 'View details of a specific repository',
    },
    isParams: (obj: unknown): obj is GhListParams =>
        typeof obj === 'object' && obj !== null && 'slug' in obj && typeof obj.slug === 'string',
}
