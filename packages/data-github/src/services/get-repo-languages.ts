import { GitHubLanguage } from '../constants'

export async function getGithubRepoLanguages(repoApiUrl: string): Promise<Partial<Record<GitHubLanguage, number>>> {
    const githubPAT = process.env.GITHUB_PAT
    if (!githubPAT) {
        throw new Error('GITHUB_PAT environment variable is not defined.')
    }

    const languagesUrl = `${repoApiUrl}/languages`
    const response = await fetch(languagesUrl, {
        headers: {
            Authorization: `Bearer ${githubPAT}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch GitHub repository languages: ${response.statusText}`)
    }

    return await response.json()
}
