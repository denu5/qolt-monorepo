import { Typography } from '@mui/joy'
import { Mdx } from '@qolt/app-components/_client'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { PageProps } from 'app/rootManifest'

import { allPages } from 'contentlayer/generated'
import { PageParams } from './manifest'

export function generateMetadata({ params }: PageProps<PageParams>) {
    return getContentMetaData(getDocBySlug(allPages, params.slug.join('/')))
}

export default function Page({ params }: PageProps<PageParams>) {
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
