import { getGhRepoBase, getGithubRepo } from '@qolt/data-github'

export async function GET(_: Request, { params }: { params: { repoId: string } }) {
    return Response.json({ data: await getGithubRepo(getGhRepoBase(params.repoId)) })
}

export const revalidate = 43200
