import {
    getGithubFullTree,
    getGithubRepo,
    getGithubRepoCommits,
    getGithubRepoContributors,
    getGithubRepoLanguages,
    getGithubRepoTopics,
} from './github-rest-api'

import { GhRepoBase } from 'models'
import { fetchGithubAPI } from './github-rest-api'

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

// https://docs.github.com/en/rest/dependency-graph/dependency-review

/**
 * 
 * Use the REST API to interact with dependency changes.

About dependency review
You can use the REST API to view dependency changes, and the security impact of these changes, before you add them to your environment. You can view the diff of dependencies between two commits of a repository, including vulnerability data for any version updates with known vulnerabilities. For more information about dependency review, see "About dependency review."
 */

export type Dependency = {
    package_url: string
    metadata: {
        name: string
        version?: string
    }
    relationship: 'direct' | 'indirect'
    scope?: 'development' | 'runtime'
}

export type DependencyDiff = {
    change_type: 'added' | 'removed' | 'changed'
    manifest: string
    ecosystem: string
    name: string
    version?: string
    package_url: string
    license?: string
    source_repository_url?: string
}

export type DependencySnapshot = {
    version: 1
    job: {
        id: string
        correlator: string
        html_url?: string
    }
    sha: string
    ref: string
    detector: {
        name: string
        version: string
        url: string
    }
    metadata: {
        [key: string]: any
    }
    manifests: {
        [name: string]: {
            name: string
            file: {
                source_location: string
            }
            metadata: {
                [key: string]: any
            }
            resolved: {
                [name: string]: Dependency
            }
        }
    }
}

export type DependencyGraphDiffResponse = {
    differences: DependencyDiff[]
}

export type SBOMResponse = {
    sbom: string
}

// Retrieves the diff of dependencies between two commits
export async function getDependencyDiff(repo: GhRepoBase, basehead: string): Promise<DependencyGraphDiffResponse> {
    return fetchGithubAPI<DependencyGraphDiffResponse>(`${repo.url}/dependency-graph/compare/${basehead}`)
}

// Retrieves the list of dependency submission snapshots for a repository
export async function getDependencySnapshots(repo: GhRepoBase): Promise<DependencySnapshot[]> {
    return fetchGithubAPI<DependencySnapshot[]>(`${repo.url}/dependency-graph/snapshots`)
}

// Retrieves the SBOM (Software Bill of Materials) for a repository
export async function getSBOM(repo: GhRepoBase): Promise<SBOMResponse> {
    return fetchGithubAPI<SBOMResponse>(`${repo.url}/dependency-graph/sbom`)
}
