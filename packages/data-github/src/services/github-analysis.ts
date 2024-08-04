import {
    getGithubFullTree,
    getGithubRepo,
    getGithubRepoCommits,
    getGithubRepoContributors,
    getGithubRepoLanguages,
    getGithubRepoTopics,
} from './github-rest-api'

import { PackageURL } from 'packageurl-js'

// Analyzes the repository structure to determine file types and directory structure
export async function analyzeRepoStructure(repo: PackageURL) {
    const tree = await getGithubFullTree(repo)
    const fileTypes = new Map<string, number>()
    const directoryStructure: Record<string, string[]> = {}

    tree.forEach((item) => {
        if (item.type === 'blob') {
            const extension = item.path.split('.').pop() || 'unknown'
            fileTypes.set(extension, (fileTypes.get(extension) || 0) + 1)
        }

        const directory = item.path.split('/').slice(0, -1).join('/')
        if (!directoryStructure[directory]) {
            directoryStructure[directory] = []
        }
        directoryStructure[directory].push(item.path.split('/').pop() || '')
    })

    return {
        fileTypes: Object.fromEntries(fileTypes),
        directoryStructure,
    }
}

// Analyzes repository activity to determine commit frequency and top contributors
export async function analyzeRepoActivity(repo: PackageURL) {
    const [commits, contributors] = await Promise.all([getGithubRepoCommits(repo), getGithubRepoContributors(repo)])

    const commitFrequency = commits.reduce(
        (acc, commit) => {
            const date = commit.commit.author.date.split('T')[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const topContributors = contributors.sort((a, b) => b.contributions - a.contributions).slice(0, 5)

    return { commitFrequency, topContributors }
}

// Analyzes the repository stack to determine programming languages and topics
export async function analyzeRepoStack(repo: PackageURL) {
    const [languages, topics] = await Promise.all([getGithubRepoLanguages(repo), getGithubRepoTopics(repo)])

    return { languages, topics }
}

// Performs a complete analysis of the repository, including basic info, structure, activity, and stack
export async function performCompleteRepoAnalysis(repo: PackageURL) {
    const [repoData, structure, activity, stack] = await Promise.all([
        getGithubRepo(repo),
        analyzeRepoStructure(repo),
        analyzeRepoActivity(repo),
        analyzeRepoStack(repo),
    ])

    return {
        basicInfo: {
            name: repoData.name,
            description: repoData.description,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            openIssues: repoData.open_issues_count,
        },
        structure,
        activity,
        stack,
    }
}

// todo this doesnt work at least for npm, there is no pattern that matches github ids to npm package ids
// Function to convert GitHub PURL to primary PURL based on repository languages
export async function githubPURLtoPrimaryPURL(repo: PackageURL): Promise<PackageURL | null> {
    const languages = await getGithubRepoLanguages(repo)
    // @ts-expect-error
    const primaryLanguage = Object.keys(languages).sort((a, b) => languages[b] - languages[a])[0]

    if (!primaryLanguage) {
        return null
    }

    switch (primaryLanguage) {
        case 'JavaScript':
        case 'TypeScript':
            return new PackageURL('npm', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'Python':
            return new PackageURL('pypi', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'Java':
        case 'Kotlin':
            return new PackageURL('maven', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'C#':
            return new PackageURL('nuget', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'Ruby':
            return new PackageURL('rubygems', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'Go':
            return new PackageURL('golang', repo.namespace, repo.name, undefined, undefined, undefined)
        case 'PHP':
            return new PackageURL('packagist', repo.namespace, repo.name, undefined, undefined, undefined)
        default:
            return null
    }
}
