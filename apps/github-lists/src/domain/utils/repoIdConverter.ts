import { GhRepoFullName } from '@qolt/data-github'

export function toUrlSafeRepoId(githubRepoId: GhRepoFullName): string {
    return githubRepoId.replace('/', ':')
}

export function toGithubRepoId(urlSafeRepoId: string): GhRepoFullName {
    return urlSafeRepoId.replace(':', '/')
}
