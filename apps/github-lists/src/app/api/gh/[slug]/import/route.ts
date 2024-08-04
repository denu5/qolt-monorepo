import { importRepo } from 'domain/services/importHelpers'
import { handleError, RouteArgs, withRepoCtx } from 'domain/utils/withRepoCtx'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: RouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            const { slug } = await req.json()
            if (!slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }

            const result = await importRepo(slug, ctx.repoMetadataService)
            return NextResponse.json(result)
        } catch (error) {
            return handleError(error)
        }
    })
}
