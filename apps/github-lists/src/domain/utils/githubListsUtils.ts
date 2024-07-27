import { getGithubList } from '@qolt/data-github'

function getGithubUser(): string {
    const githubUser = process.env.GITHUB_USER
    if (!githubUser) {
        throw new Error('GITHUB_USER environment variable is not defined.')
    }
    return githubUser
}

export async function getOwnGithubList(listName: string) {
    return getGithubList(getGithubUser(), listName)
}

export const getOwnGithubListsHtmlUrl = (listName: string) => {
    return `https://github.com/stars/${getGithubUser()}/lists/${listName}`
}
