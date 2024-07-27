import { PackageURL } from 'packageurl-js'
import { IDependency, IDependencyExtractor } from './IDependencyExtractor'
import * as cheerio from 'cheerio'
import * as toml from '@iarna/toml'

abstract class BaseDependencyExtractor implements IDependencyExtractor {
    abstract getConfigFiles(): string[]
    abstract extractDependencies(content: string, fileName: string): IDependency[]

    protected createDependency(
        ecosystem: string,
        name: string,
        version: string,
        scope: 'production' | 'development',
        manifest: string,
        namespace: string | null = null,
    ): IDependency {
        const purl = new PackageURL(ecosystem, namespace, name, version, null, null)
        return {
            purl,
            version,
            scope,
            relationship: 'direct',
            ecosystem,
            manifest,
        }
    }

    protected cleanVersion(version: string): string {
        return version
            .split(/[\s;[]/)[0]
            .replace(/[^0-9a-zA-Z.-]/g, '')
            .trim()
    }
}

export class JavaScriptDependencyExtractor extends BaseDependencyExtractor {
    getConfigFiles(): string[] {
        return ['package.json']
    }

    extractDependencies(content: string, fileName: string): IDependency[] {
        const packageJson = JSON.parse(content)
        const dependencies: IDependency[] = []

        const parseDeps = (deps: Record<string, string>, scope: 'production' | 'development') => {
            return Object.entries(deps).map(([depName, version]) => {
                const [namespace, name] = this.parseNameAndNamespace(depName)
                return this.createDependency('npm', name, version, scope, fileName, namespace)
            })
        }

        if (packageJson.dependencies) {
            dependencies.push(...parseDeps(packageJson.dependencies, 'production'))
        }
        if (packageJson.devDependencies) {
            dependencies.push(...parseDeps(packageJson.devDependencies, 'development'))
        }

        return dependencies
    }

    private parseNameAndNamespace(npmDepName: string): [string, string] {
        const namespaceAndName = npmDepName.split('/')
        return namespaceAndName.length === 1
            ? ['', encodeURIComponent(namespaceAndName[0])]
            : [encodeURIComponent(namespaceAndName[0]), encodeURIComponent(namespaceAndName[1])]
    }
}

export class PythonDependencyExtractor extends BaseDependencyExtractor {
    getConfigFiles(): string[] {
        return ['requirements.txt', 'Pipfile', 'pyproject.toml']
    }

    extractDependencies(content: string, fileName: string): IDependency[] {
        switch (fileName) {
            case 'requirements.txt':
                return this.parseRequirementsTxt(content, fileName)
            case 'Pipfile':
                return this.parsePipfile(content, fileName)
            case 'pyproject.toml':
                return this.parsePyprojectToml(content, fileName)
            default:
                throw new Error(`Unsupported file format: ${fileName}`)
        }
    }

    private parseRequirementsTxt(content: string, manifest: string): IDependency[] {
        return content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => {
                const [name, version] = line.split('==')
                return this.createDependency(
                    'pypi',
                    name.trim(),
                    this.cleanVersion(version || ''),
                    'production',
                    manifest,
                )
            })
    }

    private parsePipfile(content: string, manifest: string): IDependency[] {
        const pipfile = toml.parse(content) as Record<string, any>
        const dependencies: IDependency[] = []

        const parseDeps = (deps: Record<string, any>, scope: 'production' | 'development') => {
            Object.entries(deps).forEach(([name, version]) => {
                dependencies.push(this.createDependency('pypi', name, this.parseVersion(version), scope, manifest))
            })
        }

        if (pipfile.packages) {
            parseDeps(pipfile.packages, 'production')
        }
        if (pipfile['dev-packages']) {
            parseDeps(pipfile['dev-packages'], 'development')
        }

        return dependencies
    }

    private parsePyprojectToml(content: string, manifest: string): IDependency[] {
        const pyproject = toml.parse(content) as Record<string, any>
        const dependencies: IDependency[] = []

        const parseDeps = (deps: Record<string, any>, scope: 'production' | 'development') => {
            Object.entries(deps).forEach(([name, version]) => {
                dependencies.push(this.createDependency('pypi', name, this.parseVersion(version), scope, manifest))
            })
        }

        if (pyproject.tool?.poetry?.dependencies) {
            parseDeps(pyproject.tool.poetry.dependencies, 'production')
        }
        if (pyproject.tool?.poetry?.['dev-dependencies']) {
            parseDeps(pyproject.tool.poetry['dev-dependencies'], 'development')
        }

        return dependencies
    }

    private parseVersion(version: any): string {
        if (typeof version === 'string') {
            return this.cleanVersion(version)
        }
        if (typeof version === 'object' && version !== null) {
            return this.cleanVersion(version.version || '*')
        }
        return '*'
    }
}

export class CSharpDependencyExtractor extends BaseDependencyExtractor {
    getConfigFiles(): string[] {
        return ['.csproj', 'packages.config']
    }

    extractDependencies(content: string, fileName: string): IDependency[] {
        const $ = cheerio.load(content, { xmlMode: true })
        const dependencies: IDependency[] = []

        $('ItemGroup PackageReference, packages package').each((_, elem) => {
            const name = $(elem).attr('Include') || $(elem).attr('id')
            const version = $(elem).attr('Version') || $(elem).attr('version')
            if (name && version) {
                dependencies.push(this.createDependency('nuget', name, version, 'production', fileName))
            }
        })

        return dependencies
    }
}

export class FSharpDependencyExtractor extends BaseDependencyExtractor {
    getConfigFiles(): string[] {
        return ['.fsproj', 'paket.dependencies']
    }

    extractDependencies(content: string, fileName: string): IDependency[] {
        if (fileName.endsWith('.fsproj')) {
            return this.parseFsproj(content, fileName)
        } else if (fileName === 'paket.dependencies') {
            return this.parsePaketDependencies(content, fileName)
        } else {
            throw new Error(`Unsupported file format: ${fileName}`)
        }
    }

    private parseFsproj(content: string, manifest: string): IDependency[] {
        const $ = cheerio.load(content, { xmlMode: true })
        const dependencies: IDependency[] = []

        $('ItemGroup PackageReference').each((_, elem) => {
            const name = $(elem).attr('Include')
            const version = $(elem).attr('Version')
            if (name && version) {
                dependencies.push(this.createDependency('nuget', name, version, 'production', manifest))
            }
        })

        return dependencies
    }

    private parsePaketDependencies(content: string, manifest: string): IDependency[] {
        return content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('//'))
            .map((line) => {
                const parts = line.split(' ')
                if (parts.length >= 2) {
                    const name = parts[1]
                    const version = parts.length > 2 && parts[2] !== '~>' ? parts[2].replace(/[()]/g, '') : 'latest'
                    return this.createDependency('nuget', name, version, 'production', manifest)
                }
                return null
            })
            .filter((dep): dep is IDependency => dep !== null)
    }
}

export class PHPDependencyExtractor extends BaseDependencyExtractor {
    getConfigFiles(): string[] {
        return ['composer.json']
    }

    extractDependencies(content: string, fileName: string): IDependency[] {
        const composerJson = JSON.parse(content)
        const dependencies: IDependency[] = []

        const parseDeps = (deps: Record<string, string>, scope: 'production' | 'development') => {
            return Object.entries(deps).map(([name, version]) =>
                this.createDependency('composer', name, this.cleanVersion(version), scope, fileName),
            )
        }

        if (composerJson.require) {
            dependencies.push(...parseDeps(composerJson.require, 'production'))
        }
        if (composerJson['require-dev']) {
            dependencies.push(...parseDeps(composerJson['require-dev'], 'development'))
        }

        return dependencies
    }
}
