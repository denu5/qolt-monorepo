import { GITHUB_LANGUAGES } from '../utils'

export type GhLanguage = (typeof GITHUB_LANGUAGES)[number]

export type GhRepoFullName = string

export type GhRepoBase = {
    full_name: GhRepoFullName
    html_url: string
    url: string
}

export type GhRepoResponse = GhRepoBase & {
    id: number
    node_id: string
    name: string
    private: boolean
    owner: GhUserOrOrganization
    html_url: string
    description: string
    fork: boolean
    url: string
    forks_url: string
    keys_url: string
    collaborators_url: string
    teams_url: string
    hooks_url: string
    issue_events_url: string
    events_url: string
    assignees_url: string
    branches_url: string
    tags_url: string
    blobs_url: string
    git_tags_url: string
    git_refs_url: string
    trees_url: string
    statuses_url: string
    languages_url: string
    stargazers_url: string
    contributors_url: string
    subscribers_url: string
    subscription_url: string
    commits_url: string
    git_commits_url: string
    comments_url: string
    issue_comment_url: string
    contents_url: string
    compare_url: string
    merges_url: string
    archive_url: string
    downloads_url: string
    issues_url: string
    pulls_url: string
    milestones_url: string
    notifications_url: string
    labels_url: string
    releases_url: string
    deployments_url: string
    created_at: string
    updated_at: string
    pushed_at: string
    git_url: string
    ssh_url: string
    clone_url: string
    svn_url: string
    homepage: string
    size: number
    stargazers_count: number
    watchers_count: number
    language: GhLanguage
    has_issues: boolean
    has_projects: boolean
    has_downloads: boolean
    has_wiki: boolean
    has_pages: boolean
    has_discussions: boolean
    forks_count: number
    mirror_url: null | string
    archived: boolean
    disabled: boolean
    open_issues_count: number
    license: {
        key: string
        name: string
        spdx_id: string
        url: string
        node_id: string
    }
    allow_forking: boolean
    is_template: boolean
    web_commit_signoff_required: boolean
    topics?: string[]
    visibility: string
    forks: number
    open_issues: number
    watchers: number
    default_branch: string
    temp_clone_token: null | string
    organization: GhUserOrOrganization
    network_count: number
    subscribers_count: number
}

export type GhUserOrOrganization = {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
}

export type GhTreeItem = {
    path: string
    mode: string
    type: 'blob' | 'tree'
    sha: string
    size?: number
    url: string
}

export type GhBranch = {
    name: string
    commit: {
        sha: string
        url: string
    }
    protected: boolean
}

export type GhCommit = {
    sha: string
    commit: {
        author: {
            name: string
            email: string
            date: string
        }
        message: string
    }
}

export type GhContributor = {
    login: string
    id: number
    contributions: number
}

/**
 * Represents the structure of a Software Bill of Materials (SBOM).
 *
 * An SBOM is a formal, machine-readable inventory of software components and dependencies,
 * information about those components, and their hierarchical relationships.
 *
 * @see {@link https://spdx.dev/} for more information on the SPDX standard.
 * @see {@link https://cyclonedx.org/} for more information on the CycloneDX standard.
 */
export type SBOM = {
    /** The SPDX identifier for the SPDX document. */
    SPDXID: string

    /** The version of the SPDX specification that this document conforms to. */
    spdxVersion: string

    /** Information about the creation of this SBOM. */
    creationInfo: {
        /** The date and time the SPDX document was created. */
        created: string

        /** The tools that were used to generate the SPDX document. */
        creators: string[]
    }

    /** The name of the SPDX document. */
    name: string

    /** The license under which the SPDX document is licensed. */
    dataLicense: string

    /** The name of the repository that the SPDX document describes. */
    documentDescribes: string[]

    /** The namespace for the SPDX document. */
    documentNamespace: string

    /** An array of packages included in this SBOM. */
    packages: Array<{
        /** A unique SPDX identifier for the package. */
        SPDXID: string

        /** The name of the package. */
        name: string

        /**
         * The version of the package.
         * If the package does not have an exact version specified, a version range is given.
         */
        versionInfo: string

        /**
         * The location where the package can be downloaded,
         * or NOASSERTION if this has not been determined.
         */
        downloadLocation: string

        /**
         * Whether the package's file content has been subjected to
         * analysis during the creation of the SPDX document.
         */
        filesAnalyzed: boolean

        /** The license of the package as determined while creating the SPDX document. */
        licenseConcluded: string

        /**
         * The license of the package as declared by its author,
         * or NOASSERTION if this information was not available when the SPDX document was created.
         */
        licenseDeclared: string

        /** The distribution source of this package, or NOASSERTION if this was not determined. */
        supplier: string

        /**
         * The copyright holders of the package, and any dates present with those notices, if available.
         */
        copyrightText?: string

        /** External references for the package. */
        externalRefs?: Array<{
            /** The category of reference to an external resource this reference refers to. */
            referenceCategory: string

            /** A locator for the particular external resource this reference refers to. */
            referenceLocator: string

            /** The type of the external reference. */
            referenceType: string
        }>
    }>
}
