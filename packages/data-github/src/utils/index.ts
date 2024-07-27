import { GhRepoBase } from 'models'

export const getGhRepoBase = (repoFullName: string): GhRepoBase => {
    const repoFullNamePattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

    if (!repoFullNamePattern.test(repoFullName)) {
        throw new Error('Invalid repository full name. It should be in the format "owner/repository".')
    }

    return {
        full_name: repoFullName,
        html_url: `https://github.com/${repoFullName}`,
        url: `https://api.github.com/repos/${repoFullName}`,
    }
}

// Much reduced list
export const GITHUB_LANGUAGES = [
    'C',
    'C#',
    'C++',
    'CSS',
    'Dart',
    'Elixir',
    'F#',
    'Go',
    'HTML',
    'Java',
    'JavaScript',
    'Kotlin',
    'Lua',
    'PHP',
    'Python',
    'R',
    'Ruby',
    'Rust',
    'Scala',
    'Shell',
    'TypeScript',
] as const
