import { manifest as purlPageManifest } from './(content)/purl/[slug]/manifest'
import { manifest as articePageManifest } from './(content)/a/[...slug]/manifest'
import { manifest as defaultPageManifest } from './(content)/p/[...slug]/manifest'
import { manifest as githubListsPageManifest } from './(content)/g/manifest'
import { manifest as githubListsDetailPageManifest } from './(content)/g/lists/[docListName]/manifest'

export type PageProps<T extends object> = {
    params: T
    searchParams: { [key: string]: string | string[] | undefined }
}

export interface PageManifest<TParams = void> {
    buildUrl: TParams extends void ? () => string : (params: TParams) => string
    metadata?: {
        title: string
        description?: string
    }
    isParams?: (obj: unknown) => obj is TParams
}

export const routes = {
    home: {
        buildUrl: () => '/',
        metadata: {
            title: 'Home',
            description: 'Welcome to our platform',
        },
    },
    purl: purlPageManifest,
    article: articePageManifest,
    page: defaultPageManifest,
    ghLists: githubListsPageManifest,
    ghListsDP: githubListsDetailPageManifest,
} as const
