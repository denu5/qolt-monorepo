import { RepoMetadata, AtomicType } from '../models/RepoMetadata'
import { getCollection } from '../utils/mongoUtil'
import { Collection, ObjectId } from 'mongodb'

export class RepoMetadataService {
    protected collection: Collection<RepoMetadata>

    constructor(collection: Collection<RepoMetadata>) {
        this.collection = collection
    }

    static async init(): Promise<RepoMetadataService> {
        const collection = await getCollection<RepoMetadata>('RepoMetadata')
        return new RepoMetadataService(collection)
    }

    async createRepoMetadata(metadata: Omit<RepoMetadata, '_id' | 'createdAt' | 'updatedAt'>): Promise<RepoMetadata> {
        const now = new Date()
        const fullMetadata: RepoMetadata = {
            ...metadata,
            _id: new ObjectId(),
            createdAt: now,
            updatedAt: now,
            source: metadata.source,
            registry: metadata.registry ? metadata.registry : undefined,
        }
        const insertResult = await this.collection.insertOne(fullMetadata)
        const insertedDocument = await this.collection.findOne({ _id: insertResult.insertedId })
        if (!insertedDocument) {
            throw new Error('Failed to retrieve the newly created document.')
        }
        return insertedDocument
    }

    async updateRepoMetadata(
        slug: string,
        update: Partial<Omit<RepoMetadata, '_id' | 'slug' | 'createdAt' | 'updatedAt'>>,
    ): Promise<RepoMetadata> {
        const now = new Date()
        if (update.source) {
            update.source = update.source
        }
        if (update.registry) {
            update.registry = update.registry
        }
        const updateResult = await this.collection.findOneAndUpdate(
            { slug },
            {
                $set: { ...update, updatedAt: now },
            },
            { returnDocument: 'after' },
        )
        if (!updateResult) {
            throw new Error('No document found with the given slug.')
        }
        return updateResult
    }

    async getRepoMetadata(slug: string): Promise<RepoMetadata | null> {
        return await this.collection.findOne({ slug })
    }

    async deleteRepoMetadata(slug: string): Promise<void> {
        await this.collection.deleteOne({ slug })
    }

    async queryRepoMetadata(options: {
        sourceType?: string
        sourceNamespace?: string
        atomicType?: AtomicType
        tags?: string[]
        language?: string
        dependency?: string
        dependencyType?: string
        sortField?: keyof RepoMetadata
        sortDirection?: 'asc' | 'desc'
    }): Promise<RepoMetadata[]> {
        const query: any = {}

        if (options.sourceType) query['source.type'] = options.sourceType
        if (options.sourceNamespace) query['source.namespace'] = options.sourceNamespace
        if (options.atomicType) query.atomicType = options.atomicType
        if (options.tags && options.tags.length > 0) query.tags = { $all: options.tags }
        if (options.language) query.language = options.language
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
}
