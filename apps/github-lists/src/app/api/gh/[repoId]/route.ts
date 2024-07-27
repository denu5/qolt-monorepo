import { getGhRepoBase, getGithubRepo } from '@qolt/data-github'
import { toGithubRepoId } from 'domain/utils/repoIdConverter'

export async function GET(_: Request, { params }: { params: { repoId: string } }) {
    return Response.json({ data: await getGithubRepo(getGhRepoBase(toGithubRepoId(params.repoId))) })
}

export const revalidate = 43200
