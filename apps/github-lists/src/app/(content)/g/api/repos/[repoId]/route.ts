import { getRepoMetadataService } from 'domain/services/repoMetadataService'
import { NextRequest } from 'next/server'

type RouteParams = { params: { repoId: string } }

export async function GET(req: NextRequest, { params: { repoId } }: RouteParams) {
    const repoMetadataService = await getRepoMetadataService()

    try {
        const metadata = await repoMetadataService.getRepoMetadata(repoId)
        if (metadata) {
            return Response.json({ data: metadata })
        } else {
            return new Response('Repo metadata not found', { status: 404 })
        }
    } catch (error) {
        return new Response(`Error: ${String(error)}`, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params: { repoId } }: RouteParams) {
    const repoMetadataService = await getRepoMetadataService()

    try {
        const data = await req.json()
        const updatedMetadata = await repoMetadataService.updateRepoMetadata({ ...data, repoId })
        return Response.json({ data: updatedMetadata })
    } catch (error) {
        return Response.json({ message: `Error: ${String(error)}` }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params: { repoId } }: RouteParams) {
    const repoMetadataService = await getRepoMetadataService()

    try {
        await repoMetadataService.deleteRepoMetadata(repoId)
        return new Response(null, { status: 204 })
    } catch (error) {
        return new Response(`Error: ${String(error)}`, { status: 500 })
    }
}
