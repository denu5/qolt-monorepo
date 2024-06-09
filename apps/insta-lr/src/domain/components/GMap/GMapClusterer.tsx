import { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { Marker } from '@googlemaps/markerclusterer'
import MyLocationIcon from '@mui/icons-material/MyLocationRounded'
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

type Point = google.maps.LatLngLiteral & { key: string; name: string; data?: unknown }
export type MarkerPoints = Point[]

type Props = { points: MarkerPoints; onMarkerClick?: (point: MarkerPoints[0]) => void }

export function GMapClusterer({ points, onMarkerClick }: Props) {
    const map = useMap()
    const [markers, setMarkers] = useState<Record<string, Marker>>({})
    const clusterer = useRef<MarkerClusterer | null>(null)

    // Initialize MarkerClusterer
    useEffect(() => {
        if (!map) return
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map })
        }
    }, [map])

    // Update markers
    useEffect(() => {
        clusterer.current?.clearMarkers()
        clusterer.current?.addMarkers(Object.values(markers))
    }, [markers])

    const setMarkerRef = (marker: Marker | null, key: string) => {
        // eslint-disable-next-line
        if (marker && markers[key]) return
        // eslint-disable-next-line
        if (!marker && !markers[key]) return

        setMarkers((prev) => {
            if (marker) {
                return { ...prev, [key]: marker }
            } else {
                const newMarkers = { ...prev }
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete newMarkers[key]
                return newMarkers
            }
        })
    }

    return (
        <>
            {points.map((point) => (
                <AdvancedMarker
                    position={point}
                    key={point.key}
                    title={point.name}
                    onClick={() => onMarkerClick?.(point)}
                    ref={(marker) => setMarkerRef(marker, point.key)}
                >
                    <MyLocationIcon htmlColor="red" />
                </AdvancedMarker>
            ))}
        </>
    )
}
