import { getGhRepoBase, getGithubRepo, getGithubRepoLanguages } from '@qolt/data-github'
import { RepoMetadataInput, RepoSource, AtomicType, RepoMetadata } from 'domain/models/RepoMetadata'
import { RepoMetadataService } from './repoMetadataService'

export async function importRepo(repoId: string, repoMetadataService: RepoMetadataService) {
    let metadata = await repoMetadataService.getRepoMetadata(repoId)
    const repoBase = getGhRepoBase(repoId)
    const [githubData, languages] = await Promise.all([getGithubRepo(repoBase), getGithubRepoLanguages(repoBase)])

    if (!metadata) {
        // @ts-expect-error
        const newMetadata: RepoMetadataInput = {
            repoId,
            source: RepoSource.GitHub,
            atomicType: AtomicType.Component, // Default value
            tags: githubData.topics || [],
            language: githubData.language,
            languages: languages,
        }
        metadata = await repoMetadataService.createRepoMetadata(newMetadata)
        return { repoId, action: 'created', metadata }
    } else {
        const updatedMetadata: RepoMetadata = {
            ...metadata,
            tags: githubData.topics || metadata.tags,
            language: githubData.language || metadata.language,
            languages: languages,
        }
        metadata = await repoMetadataService.updateRepoMetadata(updatedMetadata)
        return { repoId, action: 'updated', metadata }
    }
}
