import {
    getGithubFullTree,
    getGithubRepo,
    getGithubRepoCommits,
    getGithubRepoContributors,
    getGithubRepoLanguages,
    getGithubRepoTopics,
} from './github-rest-api'

import { GhRepoBase, SBOM } from 'models'
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

/**
 * Represents a single dependency in a project.
 */
export type Dependency = {
    /**
     * The package URL (PURL) that uniquely identifies the dependency.
     * @see {@link https://github.com/package-url/purl-spec} for PURL specification.
     */
    package_url: string
    /** Metadata about the dependency. */
    metadata: {
        /** The name of the dependency. */
        name: string
        /** The version of the dependency, if available. */
        version?: string
    }
    /**
     * Indicates whether the dependency is directly required by the project or is a subdependency.
     */
    relationship: 'direct' | 'indirect'
    /**
     * Indicates whether the dependency is used in development or at runtime.
     * This field is optional and may not be present for all dependencies.
     */
    scope?: 'development' | 'runtime'
}

/**
 * Represents a change in dependencies between two commits.
 */
export type DependencyDiff = {
    /** The type of change that occurred to the dependency. */
    change_type: 'added' | 'removed' | 'changed'
    /** The manifest file where the dependency is declared. */
    manifest: string
    /** The ecosystem of the dependency (e.g., npm, pip, maven). */
    ecosystem: string
    /** The name of the dependency. */
    name: string
    /** The version of the dependency, if available. */
    version?: string
    /**
     * The package URL (PURL) that uniquely identifies the dependency.
     * @see {@link https://github.com/package-url/purl-spec} for PURL specification.
     */
    package_url: string
    /** The license of the dependency, if available. */
    license?: string
    /** The URL of the source repository for the dependency, if available. */
    source_repository_url?: string
}

/**
 * Represents the response from the GitHub API for a dependency graph diff request.
 */
export type DependencyGraphDiffResponse = {
    /** An array of dependency differences between the two compared commits. */
    differences: DependencyDiff[]
}

/**
 * Retrieves the diff of dependencies between two commits.
 *
 * This function makes an API call to GitHub to fetch the dependency changes between two specified commits.
 * It's useful for understanding how dependencies have changed in a project over time, including additions,
 * removals, and version changes.
 *
 * @param repo - The GitHub repository object containing the URL for the API call.
 * @param basehead - A string in the format "base...head" where base and head are commit SHAs or refs to compare.
 * @returns A Promise that resolves to a DependencyGraphDiffResponse containing the differences in dependencies.
 *
 * @example
 * const repo = { url: 'https://api.github.com/repos/owner/repo' };
 * const diff = await getDependencyDiff(repo, 'main...feature-branch');
 * diff.differences.forEach(change => {
 *   console.log(`${change.change_type}: ${change.name} ${change.version || ''}`);
 * });
 *
 * @see For more information on dependency review, visit:
 * @see {@link https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review} - About dependency review
 * @see {@link https://docs.github.com/en/rest/dependency-graph/dependency-review} - Dependency review API documentation
 */
export async function getDependencyDiff(repo: GhRepoBase, basehead: string): Promise<DependencyGraphDiffResponse> {
    return fetchGithubAPI<DependencyGraphDiffResponse>(`${repo.url}/dependency-graph/compare/${basehead}`)
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
export async function getSBOM(repo: GhRepoBase) {
    type SBOMResponse = {
        sbom: SBOM
    }

    return fetchGithubAPI<SBOMResponse>(`${repo.url}/dependency-graph/sbom`)
}
