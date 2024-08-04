import { getGhPackageURL, getGithubRepo } from '@qolt/data-github'
import { toGithubRepoId } from 'domain/utils/repoIdConverter'

export async function GET(_: Request, { params }: { params: { slug: string } }) {
    return Response.json({ data: await getGithubRepo(getGhPackageURL(toGithubRepoId(params.slug))) })
}

export const revalidate = 43200
