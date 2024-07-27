import { MongoClient, Collection, Db, ObjectId } from 'mongodb'

let client: MongoClient
let db: Db

export async function connectToDatabase(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in the environment variables')
    }

    client = new MongoClient(uri)
    await client.connect()
    db = client.db(process.env.MONGODB_DB_NAME)
    console.log('Connected to MongoDB')
}

export async function getCollection<T extends { _id: ObjectId }>(collectionName: string): Promise<Collection<T>> {
    if (!db) {
        await connectToDatabase()
    }
    return db.collection<T>(collectionName)
}

export async function closeConnection(): Promise<void> {
    if (client) {
        await client.close()
        console.log('Disconnected from MongoDB')
    }
}
