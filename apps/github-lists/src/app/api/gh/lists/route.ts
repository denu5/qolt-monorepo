import { allGithubLists } from 'contentlayer/generated'
import { getOwnGithubList } from 'domain/utils/githubListsUtils'

export async function GET() {
    try {
        const listsDict = await Promise.all(
            allGithubLists.map(async (list) => {
                const items = await getOwnGithubList(list.ghListName)
                return [list.ghListName, items]
            }),
        ).then(Object.fromEntries)

        return Response.json({ data: listsDict })
    } catch (error) {
        console.error('Error fetching GitHub lists:', error)
        return Response.json({ error: 'Failed to fetch GitHub lists' }, { status: 500 })
    }
}
