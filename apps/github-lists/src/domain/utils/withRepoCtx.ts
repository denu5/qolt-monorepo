import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase, closeConnection } from 'domain/utils/mongoUtil'
import { RepoMetadataService } from 'domain/services/repoMetadataService'
import { toGithubRepoId } from 'domain/utils/repoIdConverter'

export type RouteArgs = { params: { repoId: string } }

export type BaseCtx = {
    userId: ObjectId
    apiKey: string | null
}

export type RepoCtx = {
    repoMetadataService: RepoMetadataService
    repoId: string | null
} & BaseCtx

export async function withRepoCtx<T>(
    req: NextRequest,
    { params }: RouteArgs,
    handler: (context: RepoCtx) => Promise<T>,
): Promise<T> {
    await connectToDatabase()
    try {
        const service = await RepoMetadataService.init()
        const { userId, apiKey } = getAuth(req)

        const repoId = params.repoId ? toGithubRepoId(params.repoId) : null
        const context: RepoCtx = {
            userId,
            apiKey,
            repoMetadataService: service,
            repoId,
        }
        return await handler(context)
    } finally {
        await closeConnection()
    }
}

export function handleError(error: unknown) {
    console.error('Error in metadata handler:', error)
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
}

function getAuth(req: NextRequest): { userId: ObjectId; apiKey: string | null } {
    const userIdHeader = req.headers.get('X-User-ID') || 'anon'
    const apiKey = req.headers.get('X-API-Key')
    const userIdParam = req.nextUrl.searchParams.get('userId')

    let userId: string | null = null

    if (userIdHeader) {
        userId = userIdHeader
    } else if (apiKey) {
        userId = validateApiKey(apiKey)
    } else if (userIdParam) {
        userId = userIdParam
    }

    if (!userId) {
        throw new Error('User not authenticated')
    }

    return { userId: new ObjectId(userId), apiKey }
}

function validateApiKey(apiKey: string): string | null {
    // Placeholder implementation
    return apiKey === 'valid_api_key' ? 'someUserId' : null
}
