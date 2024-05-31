import { load } from 'cheerio'

const githubUser = process.env.GITHUB_USER
if (!githubUser) {
    throw new Error('GITHUB_USER environment variable is not defined.')
}

export const GITHUB_LISTS_URL = `https://github.com/stars/${githubUser}/lists`

async function fetchListPage(listName: string, page: number): Promise<string[]> {
    const response = await fetch(`${GITHUB_LISTS_URL}/${listName}?page=${String(page)}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch GitHub list: ${listName} ${String(response.status)} ${response.statusText}`)
    }

    const htmlText = await response.text()
    const $ = load(htmlText)
    // Extract the items from the HTML
    const items = $('h3 a') // list of repos as links
        .get()
        .map((el) => {
            // el is an A tag, read href from it
            const repoHref = $(el).attr('href') ?? ''
            // remove leading slash
            return repoHref.slice(1)
        })

    return items
}

export async function getGithubList(listName: string): Promise<string[]> {
    try {
        let page = 1
        let items: string[] = []
        let hasMore = true

        while (hasMore) {
            const pageItems = await fetchListPage(listName, page)
            items = items.concat(pageItems)
            // Check if there are exactly 30 items, indicating more pages might exist. if limit changes change to call until no items
            hasMore = pageItems.length === 30
            page++ // Increment to fetch the next page
        }

        return items
    } catch (error) {
        console.error(`Error fetching GitHub list: ${String(error)}`)
        return []
    }
}
