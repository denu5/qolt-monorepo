import { Collection } from 'mongodb'
import { RepoMetadata, RepoSource, AtomicType } from '../models/RepoMetadata'
import { getCollection } from '../utils/mongoUtil'

class RepoMetadataService {
    constructor(protected collection: Collection<RepoMetadata>) {}

    async createRepoMetadata(metadata: RepoMetadata): Promise<RepoMetadata> {
        const insertResult = await this.collection.insertOne(metadata)
        const insertedDocument = await this.collection.findOne({ _id: insertResult.insertedId })
        if (!insertedDocument) {
            throw new Error('Failed to retrieve the newly created document.')
        }
        return insertedDocument
    }

    async updateRepoMetadata(metadata: RepoMetadata): Promise<RepoMetadata> {
        const { repoId } = metadata
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
        sortField?: string
        sortDirection?: 'asc' | 'desc'
    }) {
        const query: any = {}
        if (options.source) query.source = options.source
        if (options.atomicType) query.atomicType = options.atomicType
        if (options.tags && options.tags.length > 0) query.tags = { $all: options.tags }

        const cursor = this.collection.find(query)

        if (options.sortField) {
            const sortDirection = options.sortDirection === 'desc' ? -1 : 1
            cursor.sort({ [options.sortField]: sortDirection })
        }

        return await cursor.toArray()
    }
}

let repoMetadataService: RepoMetadataService | null = null

export async function getRepoMetadataService() {
    if (!repoMetadataService) {
        const collection = await getCollection<RepoMetadata>('RepoMetadata')
        repoMetadataService = new RepoMetadataService(collection)
    }
    return repoMetadataService
}
