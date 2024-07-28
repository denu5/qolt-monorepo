import { getGhRepoBase, getGithubRepo, getGithubRepoLanguages, GhRepoBase, getGithubFullTree } from '@qolt/data-github'
import { RepoMetadataInput, RepoSource, AtomicType, RepoMetadata } from 'domain/models/RepoMetadata'
import { gitTreeToDirectoryTree } from 'domain/utils/dirTreeUtils'
import { RepoMetadataService } from './repoMetadataService'

export async function importRepo(repoId: string, repoMetadataService: RepoMetadataService) {
    let metadata = await repoMetadataService.getRepoMetadata(repoId)
    const repoBase = getGhRepoBase(repoId)
    const [githubData, languages] = await Promise.all([getGithubRepo(repoBase), getGithubRepoLanguages(repoBase)])

    if (!metadata) {
        const newMetadata: RepoMetadataInput = {
            repoId,
            source: RepoSource.GitHub,
            atomicType: AtomicType.Component, // Default value
            tags: githubData.topics || [],
            language: githubData.language,
            languages: languages,
            createdAt: new Date(),
            updatedAt: new Date(),

        }

        metadata = await repoMetadataService.createRepoMetadata(newMetadata)
        return { repoId, action: 'created', metadata }
    } else {
        const updatedMetadata: RepoMetadata = {
            ...metadata,
            tags: githubData.topics || metadata.tags,
            language: githubData.language || metadata.language,
            languages: languages,
            updatedAt: new Date(),
        }
        metadata = await repoMetadataService.updateRepoMetadata(updatedMetadata)
        return { repoId, action: 'updated', metadata }
    }
}

export async function processRepoMetadata(repoId: string, repoMetadataService: RepoMetadataService) {
    const metadata = await repoMetadataService.getRepoMetadata(repoId)
    if (!metadata) {
        throw new Error(`No metadata found for repo ${repoId}`)
    }

    const repoBase = getGhRepoBase(repoId)

    try {
        const processedMetadata = await processRepoDirectoryTree(metadata, repoBase)
        const finalMetadata = await repoMetadataService.updateRepoMetadata(processedMetadata)
        return { repoId, action: 'processed', metadata: finalMetadata }
    } catch (error) {
        console.error(`Error processing repo ${repoId}:`, error)
        return { repoId, action: 'processing_failed', error: String(error) }
    }
}

async function processRepoDirectoryTree(
    repoMetadata: RepoMetadata,
    repo: GhRepoBase,
    branchName?: string,
): Promise<RepoMetadata> {
    try {
        // Fetch the full tree from GitHub
        const fullTree = await getGithubFullTree(repo, branchName)

        // Convert the GitHub tree to our DirTree format
        const directoryTree = gitTreeToDirectoryTree(fullTree)

        // Extract dependencies

        // Update the repoMetadata with the new directoryTree and dependencies
        const updatedMetadata: RepoMetadata = {
            ...repoMetadata,
            directoryTree,
            updatedAt: new Date(),
        }

        return updatedMetadata
    } catch (error) {
        console.error(`Error processing directory tree for repo ${repo.full_name}:`, error)
        throw error
    }
}
