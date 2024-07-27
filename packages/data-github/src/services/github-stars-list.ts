import { load } from 'cheerio'
import { GhRepoFullName } from 'models'

// Retrieves the GitHub user from environment variables
function getGithubUser(): string {
    const githubUser = process.env.GITHUB_USER
    if (!githubUser) {
        throw new Error('GITHUB_USER environment variable is not defined.')
    }
    return githubUser
}

const GITHUB_USER_LISTS_URL = `https://github.com/stars/${getGithubUser()}/lists`

// Constructs the URL for a specific GitHub list
export const getGithubListsHtmlUrl = (listName: string): string => {
    return `${GITHUB_USER_LISTS_URL}/${listName}`
}

// Fetches a specific page of the list and extracts repository full names
async function fetchListPage(listName: string, page: number): Promise<GhRepoFullName[]> {
    const url = `${getGithubListsHtmlUrl(listName)}/?page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch GitHub list "${listName}" (Page ${page}): ${response.status} ${response.statusText}`,
        )
    }

    const htmlText = await response.text()
    const $ = load(htmlText)

    // Extract repository full names from the HTML
    const items = $('h3 a') // List of repos as links
        .map((_, el) => {
            const repoHref = $(el).attr('href') ?? ''
            return repoHref.slice(1) // Remove leading slash
        })
        .get()

    return items
}

// Retrieves all repositories from a GitHub list, handling pagination
export async function getGithubList(listName: string): Promise<GhRepoFullName[]> {
    const items: GhRepoFullName[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
        try {
            const pageItems = await fetchListPage(listName, page)
            items.push(...pageItems)
            // Check if there are more pages based on the number of items
            hasMore = pageItems.length === 30 // Adjust if the limit changes
            page++
        } catch (error) {
            console.error(`Error fetching GitHub list "${listName}": ${error}`)
            break // Exit loop if there's an error
        }
    }

    return items
}
