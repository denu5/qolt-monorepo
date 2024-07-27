import { Stack, Typography } from '@mui/joy'
import { Mdx } from '@qolt/app-components'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { allArticles } from 'contentlayer/generated'
import { DirTreeRenderer, InputType, RenderMode } from 'domain/components/DirTreeRenderer'

type PageProps = {
    params: {
        slug: string[]
    }
}

export function generateMetadata({ params }: PageProps) {
    return getContentMetaData(getDocBySlug(allArticles, params.slug.join('/')))
}

const defaultComponents = {
    ProjectTree: ({ ...props }) => (
        <DirTreeRenderer {...props} inputType={InputType.PLUS_MINUS} renderMode={RenderMode.ANSI} />
    ),
}

export default function Page({ params }: PageProps) {
    const doc = getDocBySlug(allArticles, params.slug.join('/'))

    const { title, desc, body } = doc

    return (
        <Stack>
            <Typography level="h1">{title}</Typography>
            {desc && <p>{desc}</p>}
            <Mdx code={body.code} components={defaultComponents} />
        </Stack>
    )
}
