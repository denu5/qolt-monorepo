import { getGithubList } from '@qolt/data-github'

export async function GhListRepoCount$({ ghListName }: { ghListName: string }) {
    try {
        const repos = await getGithubList(ghListName)
        const listCount = repos.length || 0
        return <>{listCount}</>
    } catch (err: unknown) {
        console.error(err)
        return <>-</>
    }
}
