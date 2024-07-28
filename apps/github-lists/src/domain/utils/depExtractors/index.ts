import { SBOM } from '@qolt/data-github'
import * as Extractors from './extractors'

import { IDependency, IDependencyExtractor } from './IDependencyExtractor'
import { PackageURL } from 'packageurl-js'

const extractorMap: Record<string, new () => IDependencyExtractor> = {
    JavaScript: Extractors.JavaScriptDependencyExtractor,
    TypeScript: Extractors.JavaScriptDependencyExtractor,
    Python: Extractors.PythonDependencyExtractor,
    'C#': Extractors.CSharpDependencyExtractor,
    'F#': Extractors.FSharpDependencyExtractor,
}

const extractorInstances: Record<string, IDependencyExtractor> = {}

export function getDependencyExtractor(language: string): IDependencyExtractor {
    if (!extractorInstances[language]) {
        const ExtractorClass = extractorMap[language]
        if (!ExtractorClass) {
            throw new Error(`No dependency extractor found for language: ${language}`)
        }
        extractorInstances[language] = new ExtractorClass()
    }
    return extractorInstances[language]
}

/**
 * Converts an SBOM to an array of IDependency objects.
 *
 * @param sbom - The Software Bill of Materials to convert
 * @returns An array of IDependency objects
 */
export function convertSBOMToDependencies(sbom: SBOM): IDependency[] {
    return sbom.packages.flatMap((pkg) => {
        const purl = parsePURL(pkg.externalRefs)
        if (!purl) return []
        const dependency: IDependency = {
            purl: purl,
            version: pkg.versionInfo,
            license: pkg.licenseConcluded !== 'NOASSERTION' ? pkg.licenseConcluded : undefined,
        }

        // Try to extract ecosystem from the package name
        const [ecosystem] = pkg.name.split(':')
        if (ecosystem) {
            dependency.ecosystem = ecosystem
        }

        // Extract source repository URL if available
        const sourceRepoRef = pkg.externalRefs?.find(
            (ref) => ref.referenceType === 'vcs' && ref.referenceCategory === 'PACKAGE-MANAGER',
        )
        if (sourceRepoRef) {
            dependency.sourceRepositoryUrl = sourceRepoRef.referenceLocator
        }

        // Note: SBOM doesn't provide direct information for scope, relationship, changeType, and manifest
        // These fields would need to be populated from other sources or left undefined

        return dependency
    })
}

/**
 * Parses the PURL from the external references of a package.
 *
 * @param externalRefs - The external references array from an SBOM package
 * @returns A PackageURL object, or undefined if no valid PURL is found
 */
function parsePURL(externalRefs?: SBOM['packages'][0]['externalRefs']) {
    const purlRef = externalRefs?.find(
        (ref) => ref.referenceType === 'purl' && ref.referenceCategory === 'PACKAGE-MANAGER',
    )

    if (purlRef) {
        try {
            return PackageURL.fromString(purlRef.referenceLocator)
        } catch (error) {
            console.error('Failed to parse PURL:', purlRef.referenceLocator, error)
        }
    }

    return undefined
}
