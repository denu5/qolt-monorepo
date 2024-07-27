import { getGithubList, getGithubRepo, getGhRepoBase, getGithubRepoLanguages } from '@qolt/data-github'
import { AtomicType, RepoMetadata, RepoSource } from 'domain/models/RepoMetadata'
import { getRepoMetadataService } from 'domain/services/repoMetadataService'
import { NextRequest } from 'next/server'

type RouteParams = { params: { ghListName: string } }

export async function GET(req: NextRequest, { params: { ghListName } }: RouteParams) {
    const repoMetadataService = await getRepoMetadataService()

    try {
        const repoIds = await getGithubList(ghListName)
        const results = await Promise.all(
            repoIds.map(async (repoId) => {
                try {
                    let metadata = await repoMetadataService.getRepoMetadata(repoId)
                    const repoBase = getGhRepoBase(repoId)
                    const [githubData, languages] = await Promise.all([
                        getGithubRepo(repoBase),
                        getGithubRepoLanguages(repoBase),
                    ])

                    if (!metadata) {
                        // If metadata doesn't exist, create a new entry
                        const newMetadata: RepoMetadata = {
                            repoId,
                            source: RepoSource.GitHub,
                            atomicType: AtomicType.Component, // Default value
                            tags: githubData.topics || [],
                            language: githubData.language || undefined,
                            languages: languages,
                        }
                        metadata = await repoMetadataService.createRepoMetadata(newMetadata)
                        return { repoId, action: 'created', metadata }
                    } else {
                        // If metadata exists, update it with fresh data from GitHub
                        const updatedMetadata: RepoMetadata = {
                            ...metadata,
                            tags: githubData.topics || metadata.tags,
                            language: githubData.language || metadata.language,
                            languages: languages,
                        }
                        metadata = await repoMetadataService.updateRepoMetadata(updatedMetadata)
                        return { repoId, action: 'updated', metadata }
                    }
                } catch (error) {
                    return { repoId, action: 'error', error: String(error) }
                }
            }),
        )

        return Response.json({
            message: `Processed ${repoIds.length} repositories from list: ${ghListName}`,
            results,
        })
    } catch (error) {
        return Response.json({ message: `Error processing list: ${String(error)}` }, { status: 500 })
    }
}
