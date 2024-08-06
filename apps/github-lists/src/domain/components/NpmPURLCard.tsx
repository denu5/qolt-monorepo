import { Link, Card, CardContent, CardOverflow, Divider, Typography } from '@mui/joy'
import { DateTimeAgo } from '@qolt/app-components/_client'
import { PackageURL } from 'packageurl-js'

interface NpmPackageInfo {
    name: string
    version?: string
    description: string
    stars: number
    lastPublished: string
    keywords?: string[]
    repository?: {
        type: string
        url: string
        directory?: string
    }
    author?: {
        name: string
    }
    license?: string
    homepage?: string
    bugs?: {
        url: string
    }
    maintainers?: Array<{
        name: string
        email: string
    }>
}

async function getNpmPackageInfo(purl: PackageURL): Promise<NpmPackageInfo> {
    try {
        // Construct the npm registry API URL
        const apiUrl = `https://registry.npmjs.org/${purl.name}`

        // Make the API request
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Extract the latest version
        const latestVersion = data['dist-tags']?.latest

        // Get the latest version's data
        const versionData = data.versions[latestVersion]

        // Fetch download count for the last month
        const downloadsUrl = `https://api.npmjs.org/downloads/point/last-month/${purl.name}`
        const downloadsResponse = await fetch(downloadsUrl)
        if (!downloadsResponse.ok) {
            throw new Error(`HTTP error! status: ${downloadsResponse.status}`)
        }
        const downloadsData = await downloadsResponse.json()

        // Calculate stars (npm doesn't provide stars directly, so we'll use downloads as a proxy)
        const stars = Math.floor(downloadsData.downloads / 100) // Rough estimate: 1 star per 100 monthly downloads

        return {
            name: data.name,
            version: latestVersion,
            description: data.description || versionData.description || '',
            stars,
            lastPublished: data.time[latestVersion], // ISO date string of the latest version
            keywords: data.keywords || versionData.keywords || [],
            repository: data.repository || versionData.repository,
            author: data.author || versionData.author,
            license: data.license || versionData.license,
            homepage: data.homepage || versionData.homepage,
            bugs: data.bugs || versionData.bugs,
            maintainers: data.maintainers,
        }
    } catch (error) {
        console.error('Error fetching npm package info:', error)
        throw new Error('Failed to fetch npm package information')
    }
}

function validateNpmPackageInfoWithGithubPurl(npmInfo: NpmPackageInfo, githubPurl: PackageURL): boolean {
    // Extract GitHub details from PURL
    const [owner, repo] = githubPurl.namespace ? [githubPurl.namespace, githubPurl.name] : githubPurl.name.split('/')

    console.log(npmInfo)
    // Check if the repository URL matches
    if (npmInfo.repository) {
        const expectedRepoUrl = `git+https://github.com/${owner}/${repo}.git`
        if (npmInfo.repository.url !== expectedRepoUrl) {
            console.warn(`Repository URL mismatch. Expected: ${expectedRepoUrl}, Got: ${npmInfo.repository.url}`)
            return false
        }

        console.debug(`Expected: ${expectedRepoUrl}, Got: ${npmInfo.repository.url}`)
    } else {
        console.warn('Repository information missing in npm package info')
        return false
    }

    // All checks passed
    return true
}

export async function NpmPURLCard$({ purl, githubPurl }: { purl: PackageURL; githubPurl?: PackageURL }) {
    try {
        const packageInfo = await getNpmPackageInfo(purl)

        if (githubPurl) validateNpmPackageInfoWithGithubPurl(packageInfo, githubPurl)

        return (
            <Card sx={{ width: '100%' }}>
                <CardContent>
                    <Typography level="title-md">
                        <Link href={`https://www.npmjs.com/package/${packageInfo.name}`} target="_blank">
                            {packageInfo.name}
                        </Link>
                        {packageInfo.version && (
                            <Typography level="body-sm" component="span" sx={{ ml: 1 }}>
                                v{packageInfo.version}
                            </Typography>
                        )}

                        <Typography level="body-sm" component="span" sx={{ ml: 1 }}>
                            {purl.toString()}
                        </Typography>
                    </Typography>
                    <Typography level="body-sm">{packageInfo.description}</Typography>
                </CardContent>
                <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                    <Divider inset="context" />
                    <CardContent orientation="horizontal">
                        <Typography level="body-xs">★ {packageInfo.stars}</Typography>
                        <Divider orientation="vertical" />
                        <Typography level="body-xs" title="Last published">
                            <DateTimeAgo value={packageInfo.lastPublished} />
                        </Typography>
                        {packageInfo.keywords && packageInfo.keywords.length > 0 && (
                            <>
                                <Divider orientation="vertical" />
                                <Typography level="body-xs">{packageInfo.keywords.slice(0, 4).join(', ')}</Typography>
                            </>
                        )}
                    </CardContent>
                </CardOverflow>
            </Card>
        )
    } catch (err: unknown) {
        console.error(err)
        return (
            <>
                <Typography level="h3">Error</Typography>
                <pre>{JSON.stringify(err, null, 2)}</pre>
            </>
        )
    }
}
