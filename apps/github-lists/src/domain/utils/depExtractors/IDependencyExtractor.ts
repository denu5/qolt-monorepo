import { PackageURL } from 'packageurl-js'

/**
 * Represents a single dependency in a project.
 */
export interface IDependency {
    /**
     * Package URL (purl) that uniquely identifies the package.
     * @see https://github.com/package-url/purl-spec
     */
    purl: PackageURL

    /**
     * Version of the dependency.
     */
    version?: string

    /**
     * Indicates whether the dependency is for production/runtime or development.
     */
    scope?: 'production' | 'development' | 'runtime'

    /**
     * Indicates whether the dependency is direct or indirect.
     */
    relationship?: 'direct' | 'indirect'

    /**
     * The ecosystem of the dependency (e.g., 'npm', 'pip', 'maven').
     */
    ecosystem?: string

    /**
     * The type of change for this dependency (useful for diffs).
     */
    changeType?: 'added' | 'removed' | 'changed'

    /**
     * The manifest file where this dependency is declared.
     */
    manifest?: string

    /**
     * The license of the dependency.
     */
    license?: string

    /**
     * The URL of the source repository for this dependency.
     */
    sourceRepositoryUrl?: string

    /**
     * Optional nested dependencies.
     */
    dependencies?: IDependency[]
}

/**
 * Interface for dependency extractors.
 * Implementations of this interface are responsible for parsing project
 * configuration files and extracting dependency information.
 */
export interface IDependencyExtractor {
    /**
     * Returns an array of file names that this extractor can process.
     *
     * @returns {string[]} An array of file names (e.g., ['package.json', 'yarn.lock', '.fsproj', 'paket.dependencies'])
     */
    getConfigFiles(): string[]

    /**
     * Extracts dependencies from the given file content.
     *
     * @param {string} content - The content of the configuration file
     * @param {string} fileName - The name of the file being processed
     * @returns {IDependency[]} An array of extracted dependencies
     * @throws {Error} If the file format is not supported by this extractor
     */
    extractDependencies(content: string, fileName: string): IDependency[]
}
