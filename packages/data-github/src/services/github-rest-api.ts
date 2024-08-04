import { GhBranch, GhCommit, GhContributor, GhLanguage, GhRepoResponse, GhTreeItem, SBOM } from 'models'
import { PackageURL } from 'packageurl-js'

// Retrieves the GitHub Personal Access Token (PAT) from environment variables
function getGithubPAT(): string {
    const githubPAT = process.env.GITHUB_PAT
    if (!githubPAT) {
        throw new Error('GITHUB_PAT environment variable is not defined.')
    }
    return githubPAT
}

// Creates a PackageURL instance for a GitHub repository
export const getGhPackageURL = (repoFullName: string): PackageURL => {
    const repoFullNamePattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

    if (!repoFullNamePattern.test(repoFullName)) {
        throw new Error('Invalid repository full name. It should be in the format "owner/repository": ' + repoFullName)
    }

    const [namespace, name] = repoFullName.split('/')
    return new PackageURL('github', namespace, name, undefined, undefined, undefined)
}

// Constructs the API URL from a PackageURL instance
function getApiUrl(repo: PackageURL, endpoint: string = ''): string {
    return `https://api.github.com/repos/${repo.namespace}/${repo.name}${endpoint}`
}

// Fetches data from the GitHub API with error handling
export async function fetchGithubAPI<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getGithubPAT()}`,
        },
    })

    if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.statusText}`)
    }

    return response.json()
}

// Retrieves the repository details
export const getGithubRepo = async (repo: PackageURL): Promise<GhRepoResponse> => {
    return fetchGithubAPI<GhRepoResponse>(getApiUrl(repo))
}

// Retrieves the languages used in the repository
export async function getGithubRepoLanguages(repo: PackageURL): Promise<Partial<Record<GhLanguage, number>>> {
    return fetchGithubAPI<Partial<Record<GhLanguage, number>>>(getApiUrl(repo, '/languages'))
}

// Retrieves a specific branch or the default branch of the repository
export async function getGithubBranch(repo: PackageURL, branchName?: string): Promise<GhBranch> {
    async function fetchBranch(branchName: string): Promise<GhBranch | null> {
        try {
            return await fetchGithubAPI<GhBranch>(getApiUrl(repo, `/branches/${branchName}`))
        } catch (error) {
            if (error instanceof Error && 'status' in error && error.status === 404) {
                return null
            }
            throw error
        }
    }

    // Fetch a specific branch if provided
    if (branchName) {
        const branch = await fetchBranch(branchName)
        if (branch) return branch
        throw new Error(`Branch "${branchName}" not found`)
    }

    // Attempt to fetch the 'main' branch first
    const mainBranch = await fetchBranch('main')
    if (mainBranch) return mainBranch

    // If 'main' doesn't exist, fetch the repository data to get the default branch
    const repoData = await fetchGithubAPI<{ default_branch: string }>(getApiUrl(repo))
    const defaultBranch = await fetchBranch(repoData.default_branch)

    if (defaultBranch) return defaultBranch
    throw new Error('Unable to find the default branch')
}

// Retrieves the full tree of the repository for a specific branch
export async function getGithubFullTree(repo: PackageURL, branchName?: string): Promise<GhTreeItem[]> {
    const branch = await getGithubBranch(repo, branchName)
    const treeData = await fetchGithubAPI<{ tree: GhTreeItem[] }>(
        getApiUrl(repo, `/git/trees/${branch.commit.sha}?recursive=1`),
    )
    return treeData.tree
}

// Retrieves the commits of the repository with optional date filters
export async function getGithubRepoCommits(repo: PackageURL, since?: string, until?: string): Promise<GhCommit[]> {
    const params = new URLSearchParams()
    if (since) params.append('since', since)
    if (until) params.append('until', until)

    const url = getApiUrl(repo, `/commits${params.toString() ? `?${params.toString()}` : ''}`)
    return fetchGithubAPI<GhCommit[]>(url)
}

// Retrieves the contributors of the repository
export async function getGithubRepoContributors(repo: PackageURL): Promise<GhContributor[]> {
    return fetchGithubAPI<GhContributor[]>(getApiUrl(repo, '/contributors'))
}

// Retrieves the topics of the repository
export async function getGithubRepoTopics(repo: PackageURL): Promise<string[]> {
    const response = await fetchGithubAPI<{ names: string[] }>(getApiUrl(repo, '/topics'))
    return response.names
}

interface GitHubFileContent {
    content: string
    encoding: string
    path: string
}

export async function getGithubRepoContents(repo: PackageURL, path: string, branch: string = 'main') {
    const url = getApiUrl(repo, `/contents/${path}?ref=${branch}`)

    try {
        const response = await fetchGithubAPI<GitHubFileContent & { name: string; type: string }>(url)

        if (response.content && response.encoding) {
            return {
                content: response.content,
                encoding: response.encoding,
                path: response.path,
            }
        } else {
            throw new Error('Unexpected response format from GitHub API')
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch file content for ${path}: ${error.message}`)
        } else {
            throw new Error(`An unknown error occurred while fetching file content for ${path}`)
        }
    }
}

/**
 * Retrieves the SBOM (Software Bill of Materials) for a repository.
 *
 * This function makes an API call to GitHub to fetch the SBOM data for the specified repository.
 * The SBOM provides a comprehensive list of all software components and dependencies used in the project.
 *
 * @param repo - The GitHub repository object containing the URL for the API call.
 * @returns A Promise that resolves to an SBOMResponse containing the SBOM data.
 *
 * @example
 * const repo = { url: 'https://api.github.com/repos/owner/repo' };
 * const sbomData = await getSBOM(repo);
 * console.log(sbomData.sbom.name); // Logs the name of the SBOM
 *
 * @see For more information on SBOMs, visit:
 * @see {@link https://www.cisa.gov/sbom} - CISA SBOM Resources
 * @see {@link https://cyclonedx.org/} - CycloneDX SBOM Standard
 * @see {@link https://spdx.dev/} - SPDX SBOM Standard
 */
export async function getSBOM(repo: PackageURL) {
    type SBOMResponse = {
        sbom: SBOM
    }
    return fetchGithubAPI<SBOMResponse>(getApiUrl(repo, '/dependency-graph/sbom'))
}
