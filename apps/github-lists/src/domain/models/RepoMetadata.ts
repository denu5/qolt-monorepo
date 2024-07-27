import { GhRepoResponse } from '@qolt/data-github'

export enum RepoSource {
    GitHub = 'github',
    NPM = 'npm',
    Other = 'other',
}

export enum AtomicType {
    Application = 'application',
    Framework = 'framework',
    Module = 'module',
    Component = 'component',
    Toolkit = 'toolkit',
}

export interface RepoMetadata {
    repoId: string // Format: {user}/{reponame}
    source: RepoSource
    atomicType: AtomicType
    tags: string[]
    language?: GhRepoResponse['language'] // Optional field for the primary language of the repo, see github api
    languages?: Partial<Record<GhRepoResponse['language'], number>> // Object containing language names and byte counts
}
