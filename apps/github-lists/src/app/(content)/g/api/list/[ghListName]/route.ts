import { getGithubList } from '@qolt/data-github'

type PageProps = { params: { ghListName: string } }

export async function GET(_: Request, { params }: PageProps) {
    return Response.json({ data: await getGithubList(params.ghListName) })
}

export const revalidate = 43200
