import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { Fork } from 'domain/models/RepoMetadata'
import { RouteArgs, withRepoCtx, handleError } from 'domain/utils/withRepoCtx'

type ForkRouteArgs = RouteArgs & { params: { forkId?: string } }

export async function GET(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.repoId) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.repoId)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }
            return NextResponse.json({ data: repo.forks })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function POST(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.repoId) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            const { name } = await req.json()

            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.repoId)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }

            const newFork: Fork = {
                userId: ctx.userId,
                name,
                directoryTree: repo.directoryTree,
                dependencies: repo.dependencies,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const updatedRepo = await ctx.repoMetadataService.addFork(ctx.repoId, newFork)
            return NextResponse.json({ data: updatedRepo.forks[updatedRepo.forks.length - 1] }, { status: 201 })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function PUT(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.repoId) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            if (!params.forkId) {
                return NextResponse.json({ error: 'Fork ID is required' }, { status: 400 })
            }

            const updateData = await req.json()

            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.repoId)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }

            const fork = repo.forks.find(
                (f) => f.userId.toString() === ctx.userId.toString() && f.userId.toString() === params.forkId,
            )
            if (!fork) {
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

            const updatedRepo = await ctx.repoMetadataService.updateFork(
                ctx.repoId,
                new ObjectId(params.forkId),
                filteredUpdate,
            )
            const updatedFork = updatedRepo.forks.find((f) => f.userId.toString() === ctx.userId.toString())

            return NextResponse.json({ data: updatedFork })
        } catch (error) {
            return handleError(error)
        }
    })
}

export async function DELETE(req: NextRequest, { params }: ForkRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            if (!ctx.repoId) {
                return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
            }
            if (!params.forkId) {
                return NextResponse.json({ error: 'Fork ID is required' }, { status: 400 })
            }

            const repo = await ctx.repoMetadataService.getRepoMetadata(ctx.repoId)
            if (!repo) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
            }

            const forkIndex = repo.forks.findIndex(
                (f) => f.userId.toString() === ctx.userId.toString() && f.userId.toString() === params.forkId,
            )
            if (forkIndex === -1) {
                return NextResponse.json(
                    { error: 'Fork not found or you do not have permission to delete it' },
                    { status: 403 },
                )
            }

            repo.forks.splice(forkIndex, 1)
            await ctx.repoMetadataService.updateRepoMetadata({ repoId: ctx.repoId, forks: repo.forks })

            return new NextResponse(null, { status: 204 })
        } catch (error) {
            return handleError(error)
        }
    })
}
