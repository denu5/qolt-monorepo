import { Box, Stack, Typography } from '@mui/joy'
import { HeaderCanvas } from '@qolt/app-components'
import { getCenter } from 'geolib'

// import { allAlbums } from 'contentlayer/generated'
import { GMap, GMapClusterer } from 'domain/components/GMap'
import trees from 'domain/trees'

export default function Page() {
    const center = getCenter([{ latitude: '47.033333', longitude: '8.583333' }])

    const mapCenter = center ? { lat: center.latitude, lng: center.longitude } : { lat: 0, lng: 0 }
    return (
        <>
            <HeaderCanvas>
                <Stack
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'rgba(var(--joy-palette-neutral-lightChannel) / 0.50)',
                        WebkitTapHighlightColor: 'transparent',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        zIndex: 1100,
                    }}
                >
                    <Box px={3} py={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography level="h1" fontSize="20px">
                                Explore
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Box flex="1">
                    <GMap defaultCenter={mapCenter} defaultZoom={5} disableDefaultUI={true}>
                        <GMapClusterer points={trees} />
                    </GMap>
                </Box>
            </HeaderCanvas>
        </>
    )
}
