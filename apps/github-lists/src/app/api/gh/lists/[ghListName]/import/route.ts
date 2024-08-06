import { NextRequest, NextResponse } from 'next/server'
import { handleError, RouteArgs, withRepoCtx } from 'domain/utils/withRepoCtx'
import { importRepoFromPURL } from 'domain/services/importHelpers'
import { getOwnGithubList } from 'domain/utils/githubListsUtils'
import { getGhPackageURL } from '@qolt/data-github'

type ListRouteArgs = RouteArgs & { params: { ghListName: string } }

export async function GET(req: NextRequest, { params }: ListRouteArgs) {
    return withRepoCtx(req, { params }, async (ctx) => {
        try {
            const repoIds = await getOwnGithubList(params.ghListName)
            const results = await Promise.all(
                repoIds.map(async (slug) => {
                    try {
                        const ghPURL = getGhPackageURL(slug)
                        return await importRepoFromPURL(ghPURL, ctx.repoMetadataService)
                    } catch (error) {
                        return { slug, action: 'error', error: String(error) }
                    }
                }),
            )

            return NextResponse.json({
                message: `Processed ${repoIds.length} repositories from list: ${params.ghListName}`,
                results,
            })
        } catch (error) {
            return handleError(error)
        }
    })
}
