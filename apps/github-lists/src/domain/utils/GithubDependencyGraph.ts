import { GhRepoBase, GhAnalysys } from '@qolt/data-github'
import { IDependency } from './depExtractors/IDependencyExtractor'
import { PackageURL } from 'packageurl-js'

export class GithubDependencyGraph {
    constructor(private repo: GhRepoBase) {}

    async getDependencyDiff(basehead: string): Promise<IDependency[]> {
        const response = await GhAnalysys.getDependencyDiff(this.repo, basehead)
        return response.differences.map((diff) => {
            const purl = this.parsePackageUrl(diff.package_url)
            return {
                purl: purl || new PackageURL(diff.ecosystem, '', diff.name, diff.version || '', null, null),
                version: diff.version || 'unknown',
                scope: 'development',
                // You might want to add more properties based on the diff information
            }
        })
    }

    async getDependencySnapshots(): Promise<IDependency[][]> {
        const snapshots = await GhAnalysys.getDependencySnapshots(this.repo)
        return snapshots.map((snapshot) =>
            Object.values(snapshot.manifests).flatMap((manifest) =>
                Object.values(manifest.resolved).map((dep) => this.mapGitHubDependencyToInternal(dep)),
            ),
        )
    }

    async getSBOM(): Promise<string> {
        const response = await GhAnalysys.getSBOM(this.repo)
        return response.sbom
    }

    private parsePackageUrl(packageUrl: string | null): PackageURL | null {
        if (!packageUrl) return null

        try {
            // PackageURL.fromString is a safer way to parse package URLs
            return PackageURL.fromString(packageUrl)
        } catch (error) {
            console.error(`Failed to parse package URL: ${packageUrl}`, error)
            return null
        }
    }

    private mapGitHubDependencyToInternal(ghDep: GhAnalysys.Dependency): IDependency {
        const purl = this.parsePackageUrl(ghDep.package_url)
        return {
            purl: purl || new PackageURL('unknown', '', ghDep.metadata.name, ghDep.metadata.version || '', null, null),
            version: ghDep.metadata.version || 'unknown',
            scope: ghDep.scope === 'development' ? 'development' : 'production',
            // Note: GitHub API doesn't provide nested dependencies, so we leave this undefined
        }
    }

    private mapInternalDependencyToGitHub(dep: IDependency): GhAnalysys.Dependency {
        return {
            package_url: dep.purl.toString(),
            metadata: {
                name: dep.purl.name,
                version: dep.version,
            },
            relationship: 'direct', // Assuming all internal dependencies are direct
            scope: dep.scope === 'development' ? 'development' : 'runtime',
        }
    }
}
