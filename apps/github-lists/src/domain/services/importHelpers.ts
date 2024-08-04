import { getGhPackageURL, getGithubRepo, getGithubRepoLanguages, getGithubFullTree } from '@qolt/data-github'
import { AtomicType, RepoMetadata } from 'domain/models/RepoMetadata'
import { gitTreeToDirectoryTree } from 'domain/utils/dirTreeUtils'
import { RepoMetadataService } from './repoMetadataService'
import { PackageURL } from 'packageurl-js'

const getPURLSlug = (purl: PackageURL) => [purl.type, purl.namespace, purl.name].join(':')

export async function importRepo(ghPURL: PackageURL, repoMetadataService: RepoMetadataService) {
    const repoIdSlug = getPURLSlug(ghPURL)
    let metadata = await repoMetadataService.getRepoMetadata(repoIdSlug)
    const [githubData, languages] = await Promise.all([getGithubRepo(ghPURL), getGithubRepoLanguages(ghPURL)])

    if (!metadata) {
        const newMetadata: Omit<RepoMetadata, '_id' | 'createdAt' | 'updatedAt'> = {
            slug: repoIdSlug,
            source: ghPURL,
            atomicType: AtomicType.Component, // Default value
            tags: githubData.topics || [],
            language: githubData.language,
            languages: languages,
        }

        metadata = await repoMetadataService.createRepoMetadata(newMetadata)
        return { slug: repoIdSlug, action: 'created', metadata }
    } else {
        const updatedMetadata: Partial<RepoMetadata> = {
            tags: githubData.topics || metadata.tags,
            language: githubData.language || metadata.language,
            languages: languages,
        }
        metadata = await repoMetadataService.updateRepoMetadata(repoIdSlug, updatedMetadata)
        return { slug: repoIdSlug, action: 'updated', metadata }
    }
}

export async function processRepoMetadata(slug: string, repoMetadataService: RepoMetadataService) {
    const metadata = await repoMetadataService.getRepoMetadata(slug)
    if (!metadata) {
        throw new Error(`No metadata found for repo ${slug}`)
    }

    const ghPURL = getGhPackageURL(slug)

    try {
        const processedMetadata = await processRepoDirectoryTree(metadata, ghPURL)
        const finalMetadata = await repoMetadataService.updateRepoMetadata(slug, processedMetadata)
        return { slug, action: 'processed', metadata: finalMetadata }
    } catch (error) {
        console.error(`Error processing repo ${slug}:`, error)
        return { slug, action: 'processing_failed', error: String(error) }
    }
}

async function processRepoDirectoryTree(
    repoMetadata: RepoMetadata,
    repo: PackageURL,
    branchName?: string,
): Promise<Partial<RepoMetadata>> {
    try {
        // Fetch the full tree from GitHub
        const fullTree = await getGithubFullTree(repo, branchName)

        // Convert the GitHub tree to our DirTree format
        const directoryTree = gitTreeToDirectoryTree(fullTree)

        // Extract dependencies
        // TODO: Implement dependency extraction logic

        // Update the repoMetadata with the new directoryTree and dependencies
        const updatedMetadata: Partial<RepoMetadata> = {
            directoryTree,
            // dependencies: extractedDependencies, // TODO: Add this when dependency extraction is implemented
        }

        return updatedMetadata
    } catch (error) {
        console.error(`Error processing directory tree for repo ${repo}:`, error)
        throw error
    }
}
