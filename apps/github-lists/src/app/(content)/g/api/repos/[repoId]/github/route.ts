import { getGithubRepo } from '@qolt/data-github'

export async function GET(_: Request, { params }: { params: { repoId: string } }) {
    return Response.json({ data: await getGithubRepo(params.repoId) })
}

export const revalidate = 43200
