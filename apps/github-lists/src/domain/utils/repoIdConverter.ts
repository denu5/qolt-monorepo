import { GhRepoFullName } from '@qolt/data-github'
import { PackageURL } from 'packageurl-js'

export function toUrlSafeRepoId(githubRepoId: GhRepoFullName): string {
    return githubRepoId.replace('/', ':')
}

export function toGithubRepoId(urlSafeRepoId: string): GhRepoFullName {
    return urlSafeRepoId.replace(':', '/')
}

export function createPURLFromSlug(slug: string | null): PackageURL {
    if (!slug) throw new Error()

    const parts = slug.split(':')
    if (parts.length !== 3) {
        throw new Error('Invalid slug format. Expected "type:namespace:name"')
    }

    const [type, namespace, name] = parts

    return new PackageURL(
        type, // type
        namespace, // namespace
        name, // name
        null, // version
        null, // qualifiers
        null, // subpath
    )
}
