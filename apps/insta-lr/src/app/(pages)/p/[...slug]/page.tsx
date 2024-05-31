import { Typography } from '@mui/joy'
import { Mdx } from '@qolt/app-components/_client'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'

import { allPages } from 'contentlayer/generated'

type PageProps = {
    params: {
        slug: string[]
    }
}

export function generateMetadata({ params }: PageProps) {
    return getContentMetaData(getDocBySlug(allPages, params.slug.join('/')))
}

export default function Page({ params }: PageProps) {
    const doc = getDocBySlug(allPages, params.slug.join('/'))

    const { title, desc, body } = doc

    return (
        <>
            <Typography level="h1">{title}</Typography>
            {desc && <p>{desc}</p>}
            <Mdx code={body.code} />
        </>
    )
}
