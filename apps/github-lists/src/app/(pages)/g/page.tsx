import { Typography } from '@mui/joy'
import { Mdx } from '@qolt/app-components/_client'
import { getDocBySlug } from '@qolt/app-contentlayer'

import { allPages } from 'contentlayer/generated'

export default function Page() {
    const doc = getDocBySlug(allPages, 'github-lists')

    const { title, desc, body } = doc

    return (
        <>
            <Typography level="h1">{title}</Typography>
            {desc && <p>{desc}</p>}
            <Mdx code={body.code} />
        </>
    )
}
