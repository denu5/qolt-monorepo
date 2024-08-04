import { ObjectId, Collection } from 'mongodb'
import { RepoMetadata, Fork } from '../models/RepoMetadata'
import { RepoMetadataService } from './repoMetadataService'

export class ForkService {
    private collection: Collection<RepoMetadata>
    private repoMetadataService: RepoMetadataService

    constructor(repoMetadataService: RepoMetadataService) {
        this.repoMetadataService = repoMetadataService
        this.collection = repoMetadataService['collection'] // Accessing protected property
    }

    async addFork(slug: string, fork: Omit<Fork, 'createdAt' | 'updatedAt'>): Promise<RepoMetadata> {
        const now = new Date()
        const fullFork: Fork = {
            ...fork,
            createdAt: now,
            updatedAt: now,
        }
        const updateResult = await this.collection.findOneAndUpdate(
            { slug: slug },
            {
                $push: { forks: fullFork },
                $set: { updatedAt: now },
            },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document found with the given slug.')
        }
        return updateResult
    }

    async updateFork(
        slug: string,
        forkId: ObjectId,
        update: Partial<Omit<Fork, 'userId' | 'createdAt'>>,
    ): Promise<RepoMetadata> {
        const now = new Date()
        const updateResult = await this.collection.findOneAndUpdate(
            { slug: slug, 'forks.userId': forkId },
            {
                $set: {
                    ...Object.entries(update).reduce((acc, [key, value]) => {
                        acc[`forks.$.${key}`] = value
                        return acc
                    }, {} as any),
                    'forks.$.updatedAt': now,
                    updatedAt: now,
                },
            },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document or fork found with the given slug and forkId.')
        }
        return updateResult
    }

    async getForks(slug: string): Promise<Fork[]> {
        const result = await this.collection.findOne({ slug: slug }, { projection: { forks: 1 } })
        return result?.forks || []
    }

    async deleteFork(slug: string, forkId: ObjectId): Promise<void> {
        const updateResult = await this.collection.updateOne(
            { slug: slug },
            {
                $pull: { forks: { userId: forkId } },
                $set: { updatedAt: new Date() },
            },
        )
        if (updateResult.matchedCount === 0) {
            throw new Error('No document found with the given slug.')
        }
        if (updateResult.modifiedCount === 0) {
            throw new Error('No fork found with the given forkId.')
        }
    }

    // New method to get a specific fork
    async getFork(slug: string, forkId: ObjectId): Promise<Fork | null> {
        const result = await this.collection.findOne(
            { slug: slug, 'forks.userId': forkId },
            { projection: { 'forks.$': 1 } },
        )
        return result?.forks?.[0] || null
    }
}
