import { MongoClient, Db, Collection, MongoClientOptions, Document } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL || ''

let client: MongoClient | null = null
let db: Db | null = null

async function connectDb(options?: MongoClientOptions): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(MONGO_URL, options)
        await client.connect()
        console.log('Connected to MongoDB')
    }
    return client
}

async function getDb(): Promise<Db> {
    if (!db) {
        const client = await connectDb()
        db = client.db()
    }
    return db
}

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    const db = await getDb()
    return db.collection<T>(collectionName)
}

export function convertToPlainObject<T>(doc: any) {
    // Convert the document to a JSON string, then parse it back to a plain object
    const plainObjectJson = JSON.stringify(doc)
    const plainObject = JSON.parse(plainObjectJson) as unknown as T
    return plainObject
}
