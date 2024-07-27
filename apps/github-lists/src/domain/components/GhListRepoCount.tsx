import { getOwnGithubList } from 'domain/utils/githubListsUtils'

export async function GhListRepoCount$({ ghListName }: { ghListName: string }) {
    try {
        const repos = await getOwnGithubList(ghListName)
        const listCount = repos.length || 0
        return <>{listCount}</>
    } catch (err: unknown) {
        console.error(err)
        return <>-</>
    }
}
