import { GitHubRepoResponse } from 'models'

export const getGithubRepo = async (repoApiUrl: string) => {
    const githubPAT = process.env.GITHUB_PAT
    if (!githubPAT) {
        throw new Error('GITHUB_PAT environment variable is not defined.')
    }

    const response = await fetch(repoApiUrl, {
        headers: {
            Authorization: `Bearer ${githubPAT}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch GitHub repository: ${response.statusText}`)
    }

    return (await response.json()) as GitHubRepoResponse
}

export const getGithubUrls = (repo: string) => {
    return {
        // browser url for the repo
        htmlUrl: `https://github.com/${repo}`,
        // api url for the repo
        apiUrl: `https://api.github.com/repos/${repo}`,
    }
}
