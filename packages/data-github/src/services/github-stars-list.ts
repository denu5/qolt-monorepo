import { load } from 'cheerio'
import { GhRepoFullName } from 'models'

/**
 * GitHub Lists is currently a beta feature without an official API.
 * As of 2024, GitHub hasn't provided a public API for accessing list data.
 * This necessitates web scraping to interact with GitHub Lists programmatically.
 *
 * These functions allow retrieval of GitHub List data through HTML scraping.
 * Be aware that web scraping may be against GitHub's terms of service.
 * Use responsibly and check GitHub's robots.txt and terms of service before deployment.
 */

type GithubListOptions = {
    username: string
    listName: string
}

/**
 * Constructs the URL for a specific GitHub list.
 *
 * @param {GithubListOptions} options - The options containing username and list name.
 * @returns {string} The URL for the specified GitHub list.
 */
export const getGithubListsHtmlUrl = ({ username, listName }: GithubListOptions): string => {
    return `https://github.com/stars/${username}/lists/${listName}`
}

/**
 * Fetches a specific page of a GitHub list and extracts repository full names.
 *
 * @param {GithubListOptions} options - The options containing username and list name.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<GhRepoFullName[]>} A promise that resolves to an array of repository full names.
 * @throws {Error} If the fetch request fails.
 */
async function fetchListPage({ username, listName }: GithubListOptions, page: number): Promise<GhRepoFullName[]> {
    const url = `${getGithubListsHtmlUrl({ username, listName })}?page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch GitHub list "${listName}" for user "${username}" (Page ${page}): ${response.status} ${response.statusText}`,
        )
    }

    const htmlText = await response.text()
    const $ = load(htmlText)

    return $('h3 a')
        .map((_, el) => {
            const repoHref = $(el).attr('href') ?? ''
            return repoHref.slice(1) // Remove leading slash
        })
        .get()
}

/**
 * Retrieves all repositories from a GitHub list, handling pagination.
 *
 * @param {string} username - The GitHub username.
 * @param {string} listName - The name of the list to retrieve.
 * @returns {Promise<GhRepoFullName[]>} A promise that resolves to an array of all repository full names in the list.
 */
export async function getGithubList(username: string, listName: string): Promise<GhRepoFullName[]> {
    const items: GhRepoFullName[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
        try {
            const pageItems = await fetchListPage({ username, listName }, page)
            items.push(...pageItems)
            hasMore = pageItems.length === 30 // Adjust if the limit changes
            page++
        } catch (error) {
            console.error(`Error fetching GitHub list "${listName}" for user "${username}": ${error}`)
            break
        }
    }

    return items
}

/**
 * Retrieves all list names for a given GitHub user.
 *
 * @param {string} username - The GitHub username.
 * @returns {Promise<string[]>} A promise that resolves to an array of list names.
 * @throws {Error} If the fetch request fails.
 */
export async function getGithubUserLists(username: string): Promise<string[]> {
    const url = `https://github.com/${username}?tab=stars&user_lists_direction=asc&user_lists_sort=name`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch user lists for "${username}": ${response.status} ${response.statusText}`)
    }

    const htmlText = await response.text()
    const $ = load(htmlText)

    const listUrls: string[] = []
    $('a').each((_, element) => {
        const href = $(element).attr('href')
        if (href && href.match(/^\/stars\/[^/]+\/lists\/[^/]+$/)) {
            listUrls.push(href.split('/').pop() as string) // Extract just the list name
        }
    })

    return listUrls
}
