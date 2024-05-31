import { AspectRatio, Box, Card, List, Stack, Typography } from '@mui/joy'
import { YouTubeEmbed } from '@next/third-parties/google'
import { getContentMetaData, getDocBySlug } from '@qolt/app-contentlayer'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

import { allVids } from 'contentlayer/generated'

type PageProps = {
    params: {
        slug: string[]
    }
}

export function generateMetadata({ params }: PageProps) {
    return getContentMetaData(getDocBySlug(allVids, params.slug.join('/')))
}

export default function Page({ params }: PageProps) {
    try {
        const doc = getDocBySlug(allVids, params.slug.join('/'))

        const ytVideos = doc.media?.map((m) => ({ videoid: m.url?.split(':')[1] }))

        return (
            <Stack flex={1}>
                <Stack maxWidth={640}>
                    <Box p={1}>
                        <Typography level="h1" fontSize="20px">
                            {doc.title}
                        </Typography>
                    </Box>
                    {doc.publishedAt && format(new Date(doc.publishedAt), 'MMMM dd, yyyy')}{' '}
                    {doc.desc && <p>{doc.desc}</p>}
                    <List>
                        {ytVideos?.map((y) => (
                            <Card key={y.videoid}>
                                <AspectRatio ratio="16/9">
                                    <YouTubeEmbed videoid={y.videoid!} height={600} width={600} params="controls=0" />
                                </AspectRatio>
                            </Card>
                        ))}
                    </List>
                </Stack>
            </Stack>
        )
    } catch (e) {
        console.log(e)
        return notFound()
    }
}
