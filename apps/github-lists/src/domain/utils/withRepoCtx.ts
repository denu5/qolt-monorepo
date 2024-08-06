import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from 'domain/utils/mongoUtil'
import { RepoMetadataService } from 'domain/services/repoMetadataService'
import { createPURLFromSlug } from 'domain/utils/repoIdConverter'
import { PackageURL } from 'packageurl-js'

export type RouteArgs = { params: { slug: string } }

export type BaseCtx = {
    userId: ObjectId
    apiKey: string | null
}

export type RepoCtx = {
    repoMetadataService: RepoMetadataService
    slug: string | null
    purl: PackageURL | null
} & BaseCtx

export async function withRepoCtx<T>(
    req: NextRequest,
    { params }: RouteArgs,
    handler: (context: RepoCtx) => Promise<T>,
): Promise<T> {
    await connectToDatabase()
    const service = await RepoMetadataService.init()
    const { userId, apiKey } = getAuth(req)

    const context: RepoCtx = {
        userId,
        apiKey,
        repoMetadataService: service,
        slug: params.slug,
        purl: createPURLFromSlug(params.slug),
    }
    return await handler(context)
}

export function handleError(error: unknown) {
    console.error('Error in metadata handler:', error)
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
}

const ANON_USER_ID = new ObjectId('000000000000000000000000')

function getAuth(req: NextRequest): { userId: ObjectId; apiKey: string | null } {
    const userIdHeader = req.headers.get('X-User-ID')
    const apiKey = req.headers.get('X-API-Key')
    const userIdParam = req.nextUrl.searchParams.get('userId')

    let userId: string | null = null

    if (userIdHeader && userIdHeader !== 'anon') {
        userId = userIdHeader
    } else if (apiKey) {
        userId = validateApiKey(apiKey)
    } else if (userIdParam && userIdParam !== 'anon') {
        userId = userIdParam
    }

    if (userId) {
        return { userId: new ObjectId(userId), apiKey }
    } else {
        // Use the hardcoded anonymous ObjectId
        return { userId: ANON_USER_ID, apiKey: null }
    }
}

function validateApiKey(apiKey: string): string | null {
    // Placeholder implementation
    return apiKey === 'valid_api_key' ? 'someUserId' : null
}
