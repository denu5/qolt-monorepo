import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { Fork } from 'domain/models/RepoMetadata'
import { RouteArgs, withRepoCtx, handleError } from 'domain/utils/withRepoCtx'
import { ForkService } from 'domain/services/forkHelperService'

type ForkRouteArgs = RouteArgs & { params: { forkId?: string } }

export async function GET(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            const forkService = new ForkService(ctx.repoMetadataService)
            const forks = await forkService.getForks(ctx.slug)
            return NextResponse.json({ data: forks })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function POST(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            const { name } = await req.json()

            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.slug)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }

            const newFork: Omit<Fork, 'createdAt' | 'updatedAt'> = {
                userId: ctx.userId,
                name,
                directoryTree: repo.directoryTree,
                dependencies: repo.dependencies,
            }

            const forkService = new ForkService(ctx.repoMetadataService)

            const updatedRepo = await forkService.addFork(ctx.slug, newFork)
            return NextResponse.json({ data: updatedRepo }, { status: 201 })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function PUT(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            if (!params.forkId) {
                return NextResponse.json({ error: 'Fork ID is required' }, { status: 400 })
            }

            const updateData = await req.json()

            const forkService = new ForkService(ctx.repoMetadataService)
            const fork = await forkService.getFork(ctx.slug, new ObjectId(params.forkId))
            if (!fork || String(fork.userId) !== String(ctx.userId)) {
                return NextResponse.json(
                    { error: 'Fork not found or you do not have permission to update it' },
                    { status: 403 },
                )
            }

            const allowedUpdates = ['name', 'directoryTree', 'dependencies']
            const filteredUpdate = Object.keys(updateData)
                .filter((key) => allowedUpdates.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updateData[key]
                    return obj
                }, {} as any)

            const updatedRepo = await forkService.updateFork(ctx.slug, new ObjectId(params.forkId), filteredUpdate)
            const updatedFork = updatedRepo.forks?.find((f) => String(f.userId) === String(ctx.userId))

            return NextResponse.json({ data: updatedFork })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function DELETE(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.slug) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            if (!params.forkId) {
                return NextResponse.json({ error: 'Fork ID is required' }, { status: 400 })
            }

            const forkService = new ForkService(ctx.repoMetadataService)
            const fork = await forkService.getFork(ctx.slug, new ObjectId(params.forkId))
            if (!fork || String(fork.userId) !== String(ctx.userId)) {
                return NextResponse.json(
                    { error: 'Fork not found or you do not have permission to delete it' },
                    { status: 403 },
                )
            }

            await forkService.deleteFork(ctx.slug, new ObjectId(params.forkId))

            return new NextResponse(null, { status: 204 })
        } catch (error) {
            return handleError(error)
        }
    })
}
