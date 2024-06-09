'use client'

import { Autocomplete, Box, Stack, Typography } from '@mui/joy'
import { getCenter } from 'geolib'

import { GMap, GMapClusterer, MarkerPoints } from 'domain/components/GMap'

import { allAlbums } from 'contentlayer/generated'
import { fetchAlbumMarkerPointsBatch } from './actions'
import { useEffect, useState } from 'react'
import { DrawerLayout } from '@qolt/app-components'

const initialSelected = [allAlbums.map((album) => ({ label: album.title, spaceAlbumId: album.spaceAlbumId! }))[0]]

const defaultCenter = { lat: 47.033333, lng: 8.583333 }

const getMapCenter = (ps: MarkerPoints) => {
    const converted = ps.map((p) => ({ latitude: p.lat, longitude: p.lng }))
    const center = getCenter(converted)
    return center ? { lat: center.latitude, lng: center.longitude } : defaultCenter
}

export default function Page() {
    const [markerPoints, setMarkerPoints] = useState<MarkerPoints>([])
    const [error, setError] = useState<any>(null)

    const [mapCenter, setMapCenter] = useState(defaultCenter)

    const loadMarkers = async (spaceAlbumIds: string[]) => {
        try {
            const result = await fetchAlbumMarkerPointsBatch(spaceAlbumIds)

            const p = result.flat()
            setMarkerPoints(p)
            setMapCenter(getMapCenter(p))
            setError(null)
        } catch (error) {
            setError(error)
            setMarkerPoints([])
        }
    }

    useEffect(() => {
        loadMarkers(initialSelected.map((a) => a.spaceAlbumId))
    }, [])

    const handleChange = (ids: string[]) => {
        loadMarkers(ids)
    }

    return (
        <DrawerLayout.Children>
            <DrawerLayout.TopRail title="Places" />
            <Box flex="1" position="relative">
                <GMap center={mapCenter} defaultZoom={5} disableDefaultUI={true}>
                    <GMapClusterer points={markerPoints} onMarkerClick={console.log} />
                </GMap>
                <Stack position="absolute" top={0} left={0} right={0} alignItems="center">
                    <Box maxWidth="50vw" p={2}>
                        <Autocomplete
                            multiple
                            defaultValue={initialSelected}
                            options={allAlbums.map((album) => ({
                                label: album.title,
                                spaceAlbumId: album.spaceAlbumId || 'no-id',
                            }))}
                            getOptionLabel={(option) => option.label}
                            onChange={(ev, albums) => handleChange(albums.map((a) => a.spaceAlbumId))}
                        />
                        {error && <p>{String(error)}</p>}
                    </Box>
                </Stack>
            </Box>
        </DrawerLayout.Children>
    )
}
