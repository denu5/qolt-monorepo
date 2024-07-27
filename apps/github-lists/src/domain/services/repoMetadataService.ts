import { RepoMetadata, RepoSource, AtomicType, Fork, RepoMetadataInput } from '../models/RepoMetadata'
import { getCollection } from '../utils/mongoUtil'
import { Collection, ObjectId } from 'mongodb'

export class RepoMetadataService {
    private collection: Collection<RepoMetadata>

    constructor(collection: Collection<RepoMetadata>) {
        this.collection = collection
    }

    static async init(): Promise<RepoMetadataService> {
        const collection = await getCollection<RepoMetadata>('RepoMetadata')
        return new RepoMetadataService(collection)
    }

    async createRepoMetadata(metadata: RepoMetadataInput): Promise<RepoMetadata> {
        const now = new Date()
        metadata.createdAt = now
        metadata.updatedAt = now

        // @ts-expect-error metadata id stuff pls fix
        const insertResult = await this.collection.insertOne(metadata)
        const insertedDocument = await this.collection.findOne({ _id: insertResult.insertedId })
        if (!insertedDocument) {
            throw new Error('Failed to retrieve the newly created document.')
        }
        return insertedDocument
    }

    async updateRepoMetadata(metadata: Partial<RepoMetadata>): Promise<RepoMetadata> {
        const { repoId } = metadata
        metadata.updatedAt = new Date()
        const updateResult = await this.collection.findOneAndUpdate(
            { repoId },
            { $set: metadata },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document found with the given repoId.')
        }
        return updateResult
    }

    async getRepoMetadata(repoId: string): Promise<RepoMetadata | null> {
        return await this.collection.findOne({ repoId })
    }

    async deleteRepoMetadata(repoId: string): Promise<void> {
        await this.collection.deleteOne({ repoId })
    }

    async queryRepoMetadata(options: {
        source?: RepoSource
        atomicType?: AtomicType
        tags?: string[]
        dependency?: string
        dependencyType?: 'production' | 'development'
        sortField?: string
        sortDirection?: 'asc' | 'desc'
    }) {
        const query: any = {}
        if (options.source) query.source = options.source
        if (options.atomicType) query.atomicType = options.atomicType
        if (options.tags && options.tags.length > 0) query.tags = { $all: options.tags }
        if (options.dependency) {
            query['dependencies.name'] = options.dependency
            if (options.dependencyType) {
                query['dependencies.type'] = options.dependencyType
            }
        }

        const cursor = this.collection.find(query)

        if (options.sortField) {
            const sortDirection = options.sortDirection === 'desc' ? -1 : 1
            cursor.sort({ [options.sortField]: sortDirection })
        }

        return await cursor.toArray()
    }

    async addFork(repoId: string, fork: Fork): Promise<RepoMetadata> {
        const now = new Date()
        fork.createdAt = now
        fork.updatedAt = now
        const updateResult = await this.collection.findOneAndUpdate(
            { repoId },
            {
                $push: { forks: fork },
                $set: { updatedAt: now },
            },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document found with the given repoId.')
        }
        return updateResult
    }

    async updateFork(repoId: string, forkId: ObjectId, update: Partial<Fork>): Promise<RepoMetadata> {
        const now = new Date()
        update.updatedAt = now
        const updateResult = await this.collection.findOneAndUpdate(
            { repoId, 'forks.userId': forkId },
            {
                $set: Object.entries(update).reduce((acc, [key, value]) => {
                    acc[`forks.$.${key}`] = value
                    return acc
                }, {} as any),
                updatedAt: now,
            },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document or fork found with the given repoId and forkId.')
        }
        return updateResult
    }
}
