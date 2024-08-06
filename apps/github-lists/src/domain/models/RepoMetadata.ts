import { IDependency } from 'domain/utils/depExtractors/IDependencyExtractor'
import { DirTree } from 'domain/utils/dirTreeUtils'
import { ObjectId } from 'mongodb'
import { PackageURL } from 'packageurl-js'

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
    directoryTree?: DirTree
    dependencies?: IDependency[]
    createdAt: Date
    updatedAt: Date
}

export type RepoMetadata = {
    _id: ObjectId
    slug: string
    source?: PackageURL
    registry?: PackageURL

    atomicType: AtomicType
    tags: string[]
    language?: string
    languages?: Partial<Record<string, number>>
    directoryTree?: DirTree
    dependencies?: IDependency[]
    forks?: Fork[]

    createdAt: Date
    updatedAt: Date
}
