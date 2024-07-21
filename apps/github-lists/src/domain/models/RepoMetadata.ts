import { GitHubLanguage } from '@qolt/data-github'

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
    language?: GitHubLanguage // Optional field for the primary language of the repo, see github api
    languages?: Partial<Record<GitHubLanguage, number>> // Object containing language names and byte counts
}
