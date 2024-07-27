import { GhRepoBase } from 'models'
import {
    getGithubFullTree,
    getGithubRepo,
    getGithubRepoCommits,
    getGithubRepoContributors,
    getGithubRepoLanguages,
    getGithubRepoTopics,
} from './github-rest-api'

// Analyzes the repository structure to determine file types and directory structure
export async function analyzeRepoStructure(repo: GhRepoBase) {
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
export async function analyzeRepoActivity(repo: GhRepoBase) {
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
export async function analyzeRepoStack(repo: GhRepoBase) {
    const [languages, topics] = await Promise.all([getGithubRepoLanguages(repo), getGithubRepoTopics(repo)])

    return { languages, topics }
}

// Performs a complete analysis of the repository, including basic info, structure, activity, and stack
export async function performCompleteRepoAnalysis(repo: GhRepoBase) {
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
