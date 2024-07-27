import { GhRepoResponse } from '@qolt/data-github'
import { IDependency } from 'domain/utils/depExtractors/IDependencyExtractor'
import { DirTree } from 'domain/utils/dirTreeUtils'
import { ObjectId } from 'mongodb'

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

export type Fork = {
    userId: ObjectId
    name: string
    directoryTree: DirTree
    dependencies: IDependency[]
    createdAt: Date
    updatedAt: Date
}

export type RepoMetadata = {
    _id: ObjectId
    repoId: string
    source: RepoSource
    atomicType: AtomicType
    tags: string[]
    language?: GhRepoResponse['language'] // Optional field for the primary language of the repo, see github api
    languages?: Partial<Record<GhRepoResponse['language'], number>> // Object containing language names and byte counts
    directoryTree: DirTree
    dependencies: IDependency[]
    forks: Fork[]
    createdAt: Date
    updatedAt: Date
}

// If you need to create a RepoMetadata object without an _id (e.g., when inserting a new document),
export type RepoMetadataInput = Omit<RepoMetadata, '_id'> & { _id?: ObjectId }
