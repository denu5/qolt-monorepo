import { RepoMetadata } from 'domain/models/RepoMetadata'
import { RepoMetadataService } from 'domain/services/repoMetadataService'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const repoMetadataService = await RepoMetadataService.init()

    try {
        const data = (await req.json()) as RepoMetadata
        await repoMetadataService.createRepoMetadata(data)

        return Response.json({ message: 'Repo metadata inserted successfully.' })
    } catch (error) {
        return Response.json({ message: `Error: ${String(error)}` }, { status: 400 })
    }
}

export async function GET(req: NextRequest) {
    const repoMetadataService = await RepoMetadataService.init()

    try {
        const { searchParams } = req.nextUrl
        const source = searchParams.get('source')
        const atomicType = searchParams.get('atomicType')
        const tags = searchParams.get('tags')
        const sortField = searchParams.get('sortField')
        const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null

        const queryOptions: any = {}
        if (source) queryOptions.source = source
        if (atomicType) queryOptions.atomicType = atomicType
        if (tags) queryOptions.tags = tags.split(',')
        if (sortField) queryOptions.sortField = sortField
        if (sortDirection) queryOptions.sortDirection = sortDirection

        const queryResult = await repoMetadataService.queryRepoMetadata(queryOptions)
        return Response.json({ data: queryResult })
    } catch (error) {
        return Response.json({ message: `Error: ${String(error)}` }, { status: 500 })
    }
}
