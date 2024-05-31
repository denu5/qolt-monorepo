import { getGithubRepo } from '@qolt/data-github'

export async function GET(_: Request, { params }: { params: { id: string } }) {
    return Response.json({ data: await getGithubRepo(params.id) })
}

export const revalidate = 43200
