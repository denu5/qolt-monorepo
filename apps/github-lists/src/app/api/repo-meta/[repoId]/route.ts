import { NextRequest, NextResponse } from 'next/server'
import { toUrlSafeRepoId } from 'domain/utils/repoIdConverter'
import { handleError, RouteArgs, withRepoCtx } from 'domain/utils/withRepoCtx'

export async function GET(req: NextRequest, { params }: RouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (ctx.slug) {
                const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.slug)
                if (!repo) {
                    return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
                }
                const responseRepo = {
                    ...repo,
                    slug: toUrlSafeRepoId(repo.slug),
                }
                return NextResponse.json({ data: responseRepo })
            } else {
                const queryParams = Object.fromEntries(new URL(req.url).searchParams)
                const repos = await ctx.repoMetadataService.queryRepoMetadata(queryParams)
                const responseRepos = repos.map((repo) => ({
                    ...repo,
                    slug: toUrlSafeRepoId(repo.slug),
                }))
                return NextResponse.json({ data: responseRepos })
            }
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function DELETE(req: NextRequest, { params }: RouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }

            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.slug)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }

            await ctx.repoMetadataService.deleteRepoMetadata(ctx.slug)
            return new NextResponse(null, { status: 204 })
        } catch (error) {
            return handleError(error)
        }
    })
}
