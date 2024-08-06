import { Link, Card, CardContent, CardOverflow, Divider, Typography } from '@mui/joy'
import { DateTimeAgo } from '@qolt/app-components/_client'
import { getGithubRepo } from '@qolt/data-github'
import { PrimaryRegistryLocator } from 'domain/utils/PackageLocator'
import { PackageURL } from 'packageurl-js'

export async function GhRepoCard$({ purl }: { purl: PackageURL }) {
    try {
        // todo remove later
        const p = new PrimaryRegistryLocator(purl)
        console.log(p.getPackageDp())

        const repo = await getGithubRepo(purl)
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent>
                    <Typography level="title-md">
                        <Link href={repo.owner.html_url} target="_blank">
                            {repo.owner.login}
                        </Link>
                        <span style={{ opacity: 0.5 }}>{' / '}</span>
                        <Link href={repo.html_url} target="_blank">
                            {repo.name}
                        </Link>
                    </Typography>
                    <Typography level="body-sm">{repo.description}</Typography>
                </CardContent>
                <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                    <Divider inset="context" />
                    <CardContent orientation="horizontal">
                        <Typography level="body-xs">★ {repo.stargazers_count}</Typography>
                        <Divider orientation="vertical" />
                        <Typography level="body-xs" title="Last pushed">
                            <DateTimeAgo value={repo.pushed_at} />
                        </Typography>
                        {repo.topics && repo.topics.length > 0 && (
                            <>
                                <Divider orientation="vertical" />
                                <Typography level="body-xs">{repo.topics.slice(0, 4).join(', ')}</Typography>
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
