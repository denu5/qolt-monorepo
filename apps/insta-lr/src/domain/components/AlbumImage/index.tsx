'use client'
import { Card, CardContent, Typography, AspectRatio, CardOverflow, Divider, Box, Grid } from '@mui/joy'
import { resourceToAlbumImage } from '@qolt/data-lightroom'
import { format } from 'date-fns'
import Image, { ImageLoaderProps } from 'next/image'

import { GMap, GMapClusterer } from 'domain/components/GMap'

import { AlbumImageDebug } from './AlbumImageDebug'
import { IS_CFLOADER_ACTIVE, cloudflareImageLoader } from './utils-cloudflare-image-loader'

type AlbumImage = ReturnType<typeof resourceToAlbumImage>

export const AlbumImageCard = ({ img, baseUrl }: { img: AlbumImage; baseUrl: string }) => {
    const { location } = img.meta
    const [lat, lng] = location ? [location.latitude, location.longitude] : [0, 0]

    const imageLoader = (props: ImageLoaderProps) => cloudflareImageLoader({ ...props, format: 'webp' })

    return (
        <Card sx={{ width: '100%' }}>
            <CardOverflow>
                <AspectRatio ratio={img.dimensions.aspectRatio}>
                    <Image
                        {...(IS_CFLOADER_ACTIVE && { loader: imageLoader })}
                        quality={95}
                        src={`${baseUrl}${img.renditions.xl}`}
                        title={img.meta.title ?? ''}
                        alt={img.meta.title ?? ''}
                        fill
                    />
                </AspectRatio>
            </CardOverflow>
            {img.meta && (
                <>
                    {img.meta.title && (
                        <CardContent>
                            <Typography level="title-md">{img.meta.title}</Typography>
                            <Typography>{img.meta.description}</Typography>
                        </CardContent>
                    )}
                    <CardContent orientation="horizontal">
                        <AlbumImageDebug
                            iconSx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                m: 1,
                                opacity: 0.3,
                                transition: 'all 300ms linear',
                                cursor: 'pointer',
                                ':hover': { opacity: 1 },
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <AspectRatio ratio="1">
                                        <Image
                                            src={`${baseUrl}${img.renditions.xl}`}
                                            // loader={cloudflareImageLoader}
                                            title={img.meta.title ?? ''}
                                            alt={img.meta.title ?? ''}
                                            fill
                                        />
                                    </AspectRatio>
                                </Grid>
                                <Grid xs={6}>
                                    <GMap defaultCenter={{ lat, lng }} defaultZoom={15} disableDefaultUI={false}>
                                        <GMapClusterer points={[{ lat, lng, name: 'shot', key: img._id }]} />
                                    </GMap>
                                </Grid>
                            </Grid>
                            <Box sx={{ overflow: 'scroll', flex: 1 }}>
                                <pre>{JSON.stringify(img, null, 2)}</pre>
                            </Box>
                        </AlbumImageDebug>

                        {img.meta.camera.make && !img.meta.camera.make.startsWith('Apple') && (
                            <Typography level="body-xs" textColor="text.secondary">
                                {img.meta.camera.make} {img.meta.camera.model}
                            </Typography>
                        )}
                        <Typography level="body-xs" textColor="text.secondary">
                            {img.meta.camera.lens}
                        </Typography>
                    </CardContent>
                    <CardContent orientation="horizontal">
                        <Typography level="body-xs" textColor="text.secondary">
                            {format(new Date(img.captureDate), 'MMM dd, yyyy')}
                        </Typography>
                        {location && (
                            <>
                                <Divider orientation="vertical" />
                                <Typography level="body-xs" textColor="text.secondary">
                                    {[location.city, location.sublocation].flat().filter(Boolean).join(' ')},{' '}
                                    {location.country}
                                </Typography>
                            </>
                        )}
                    </CardContent>
                </>
            )}
        </Card>
    )
}
