import { getOwnGithubList } from 'domain/utils/githubListsUtils'

type PageProps = { params: { ghListName: string } }

export async function GET(_: Request, { params }: PageProps) {
    return Response.json({ data: await getOwnGithubList(params.ghListName) })
}

export const revalidate = 43200
