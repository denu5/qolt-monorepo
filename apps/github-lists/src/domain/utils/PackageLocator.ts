import { PackageURL } from 'packageurl-js'

interface ExtUrl {
    name: string
    url: string
}

const SUPPORTED_TYPES = ['npm', 'pypi', 'maven', 'nuget', 'rubygems', 'golang', 'packagist'] as const
type SupportedType = (typeof SUPPORTED_TYPES)[number]

abstract class PackageURLLocator {
    protected purl: PackageURL

    constructor(purl: PackageURL) {
        this.purl = purl
    }

    abstract getPackageDp(): ExtUrl[]
    abstract getRegistryDp(): ExtUrl | null
}

export class PrimaryRegistryLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        const primaryDp = this.getRegistryDp()
        return primaryDp ? [primaryDp] : []
    }

    getRegistryDp(): ExtUrl | null {
        const { type, namespace, name } = this.purl
        switch (type as SupportedType) {
            case 'npm':
                return {
                    name: 'npm',
                    url: `https://www.npmjs.com/package/${namespace ? `@${namespace}/` : ''}${name}`,
                }
            case 'pypi':
                return {
                    name: 'PyPI',
                    url: `https://pypi.org/project/${name}`,
                }
            case 'maven':
                return {
                    name: 'Maven Central',
                    url: `https://search.maven.org/artifact/${namespace}/${name}`,
                }
            case 'nuget':
                return {
                    name: 'NuGet Gallery',
                    url: `https://www.nuget.org/packages/${name}`,
                }
            case 'rubygems':
                return {
                    name: 'RubyGems',
                    url: `https://rubygems.org/gems/${name}`,
                }
            case 'golang':
                return {
                    name: 'Go Packages',
                    url: `https://pkg.go.dev/${namespace}/${name}`,
                }
            case 'packagist':
                return {
                    name: 'Packagist',
                    url: `https://packagist.org/packages/${namespace}/${name}`,
                }
            default:
                return null
        }
    }
}

export class OssIndexLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        return [
            {
                name: 'OSS Index by Sonatype',
                url: `https://ossindex.sonatype.org/component/${this.purl.toString()}`,
            },
        ]
    }

    getRegistryDp(): ExtUrl | null {
        return null // OSS Index doesn't have a specific registry detail page
    }
}

export class LibrariesIoLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        const version = this.purl.version || 'latest'
        const type = this.purl.type === 'composer' ? 'packagist' : this.purl.type
        return [
            { name: 'Libraries.io', url: `https://libraries.io/${type}/${this.purl.name}` },
            // {
            //     name: 'Libraries.io Dependencies API',
            //     url: `https://libraries.io/api/${type}/${this.purl.name}/${version}/dependencies?api_key=${this.config.connectionString}`,
            // },
        ]
    }

    getRegistryDp(): ExtUrl | null {
        const type = this.purl.type === 'composer' ? 'packagist' : this.purl.type
        return {
            name: 'Libraries.io Registry',
            url: `https://libraries.io/${type}/${this.purl.name}`,
        }
    }
}

export class SnykLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        const snykType = this.purl.type === 'packagist' ? 'composer' : this.purl.type
        const baseUrl = `https://snyk.io/advisor/${snykType}-package/${this.purl.name}`
        const securityUrl = this.purl.version
            ? `https://security.snyk.io/package/${snykType}/${this.purl.name}/${this.purl.version}`
            : `https://security.snyk.io/package/${snykType}/${this.purl.name}`
        return [
            { name: 'Snyk Advisor', url: baseUrl },
            { name: 'Snyk Security', url: securityUrl },
        ]
    }

    getRegistryDp(): ExtUrl | null {
        const snykType = this.purl.type === 'packagist' ? 'composer' : this.purl.type
        return {
            name: 'Snyk Registry',
            url: `https://snyk.io/advisor/${snykType}-package/${this.purl.name}`,
        }
    }
}

export class GitHubLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        const urls: ExtUrl[] = []
        // todo need to build a service which does the lookup to githuburls https://github.com/nice-registry/all-the-package-repos/tree/master/data
        // "@meterio/sumer-js": "https://github.com/meterio/sumer-js",
        // "@meterio/voltswap-v2-sdk": "https://github.com/meterio/voltswapv2-sdk",
        // "@meterio/web3-context": "https://github.com/ChainSafe/web3-context",
        // "@meterius/graphql-codegen-plugin-full-fragments": "https://github.com/Meterius/graphql-codegen-plugin-full-fragments",
        // "@meterius/graphql-codegen-plugin-python": "https://github.com/Meterius/graphql-codegen-plugin-python",
        // "@meterius/typescript-protobuf": "https://github.com/Meterius/typescript-protbuf",
        // "@metex/trading-alerts": "https://github.com/elijaholmos/trading-alerts",
        // "@meth/react-native-coverflow": "https://github.com/Bhoos/react-native-coverflow",
        // "@meth/react-navigation-redux-helpers": "https://github.com/react-navigation/react-navigation-redux-helpers",
        // "@meth/sjcl": "https://github.com/bitwiseshiftleft/sjcl",
        // "@methmal/images-to-pdf": "https://github.com/methmal66/images-to-pdf",
        // "@methmal/version": "https://github.com/methmal66/version",
        // "@methodexists/ant-header": "https://github.com/MethodExists/ant-header",
        // or can go via RepoMetaDataService
        return urls
    }

    getRegistryDp(): ExtUrl | null {
        return null
    }
}

export class PackagistLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        return this.purl.type === 'packagist'
            ? [
                  {
                      name: 'Packagist',
                      url: `https://packagist.org/packages/${this.purl.namespace ? `${this.purl.namespace}/` : ''}${this.purl.name}`,
                  },
              ]
            : []
    }

    getRegistryDp(): ExtUrl | null {
        return this.purl.type === 'packagist'
            ? {
                  name: 'Packagist Registry',
                  url: `https://packagist.org/packages/${this.purl.namespace ? `${this.purl.namespace}/` : ''}${this.purl.name}`,
              }
            : null
    }
}

export class TechIntelligenceLocator extends PackageURLLocator {
    getPackageDp(): ExtUrl[] {
        const name = this.purl.name.toLowerCase()
        return [
            { name: 'StackShare', url: `https://stackshare.io/${name}` },
            {
                name: 'BuiltWith Trends',
                url: `https://trends.builtwith.com/${['angular', 'react', 'vue'].includes(name) ? 'javascript' : name === 'umbraco' ? 'cms' : 'websitelist'}/${name}`,
            },
            {
                name: 'Wappalyzer',
                url: `https://www.wappalyzer.com/technologies/${['angular', 'react', 'vue'].includes(name) ? 'javascript-frameworks' : name === 'redis' ? 'databases' : name === 'umbraco' ? 'cms' : ''}/${name}/`,
            },
            { name: 'AlternativeTo', url: `https://alternativeto.net/software/${name}/` },
            ...(this.purl.type === 'npm'
                ? [{ name: 'LibHunt', url: `https://js.libhunt.com/${name}-alternatives` }]
                : []),
            { name: 'SourceForge', url: `https://sourceforge.net/projects/${name}/` },
        ]
    }

    getRegistryDp(): ExtUrl | null {
        return null
    }
}

export class PackageLocatorFactory {
    static create(purl: PackageURL): PackageURLLocator[] {
        return [
            new PrimaryRegistryLocator(purl),
            new OssIndexLocator(purl),
            new LibrariesIoLocator(purl),
            new SnykLocator(purl),
            new GitHubLocator(purl),
            new PackagistLocator(purl),
            new TechIntelligenceLocator(purl),
        ]
    }
}
