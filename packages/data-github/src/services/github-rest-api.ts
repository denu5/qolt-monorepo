import { GhBranch, GhCommit, GhContributor, GhLanguage, GhRepoBase, GhRepoResponse, GhTreeItem } from 'models'

// Retrieves the GitHub Personal Access Token (PAT) from environment variables
function getGithubPAT(): string {
    const githubPAT = process.env.GITHUB_PAT
    if (!githubPAT) {
        throw new Error('GITHUB_PAT environment variable is not defined.')
    }
    return githubPAT
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
export const getGithubRepo = async (repo: GhRepoBase): Promise<GhRepoResponse> => {
    return fetchGithubAPI<GhRepoResponse>(repo.url)
}

// Retrieves the languages used in the repository
export async function getGithubRepoLanguages(repo: GhRepoBase): Promise<Partial<Record<GhLanguage, number>>> {
    return fetchGithubAPI<Partial<Record<GhLanguage, number>>>(`${repo.url}/languages`)
}

// Retrieves a specific branch or the default branch of the repository
export async function getGithubBranch(repo: GhRepoBase, branchName?: string): Promise<GhBranch> {
    async function fetchBranch(branchName: string): Promise<GhBranch | null> {
        try {
            return await fetchGithubAPI<GhBranch>(`${repo.url}/branches/${branchName}`)
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
    const repoData = await fetchGithubAPI<{ default_branch: string }>(repo.url)
    const defaultBranch = await fetchBranch(repoData.default_branch)

    if (defaultBranch) return defaultBranch
    throw new Error('Unable to find the default branch')
}

// Retrieves the full tree of the repository for a specific branch
export async function getGithubFullTree(repo: GhRepoBase, branchName?: string): Promise<GhTreeItem[]> {
    const branch = await getGithubBranch(repo, branchName)
    const treeData = await fetchGithubAPI<{ tree: GhTreeItem[] }>(
        `${repo.url}/git/trees/${branch.commit.sha}?recursive=1`,
    )
    return treeData.tree
}

// Retrieves the commits of the repository with optional date filters
export async function getGithubRepoCommits(repo: GhRepoBase, since?: string, until?: string): Promise<GhCommit[]> {
    const params = new URLSearchParams()
    if (since) params.append('since', since)
    if (until) params.append('until', until)

    const url = `${repo.url}/commits${params.toString() ? `?${params.toString()}` : ''}`
    return fetchGithubAPI<GhCommit[]>(url)
}

// Retrieves the contributors of the repository
export async function getGithubRepoContributors(repo: GhRepoBase): Promise<GhContributor[]> {
    return fetchGithubAPI<GhContributor[]>(`${repo.url}/contributors`)
}

// Retrieves the topics of the repository
export async function getGithubRepoTopics(repo: GhRepoBase): Promise<string[]> {
    const response = await fetchGithubAPI<{ names: string[] }>(`${repo.url}/topics`)
    return response.names
}
