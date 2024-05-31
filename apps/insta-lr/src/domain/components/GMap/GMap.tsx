import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps'
import React from 'react'

const apiKey = process.env.NEXT_PUBLIC_GMAPS_KEY // https://console.cloud.google.com/google/maps-apis/credentials
const defaultMapId = 'ccbb6935b6d5ea42' // MapId Management @see https://console.cloud.google.com/google/maps-apis/studio/maps

type Props = {
    mapTypeId?: string
    mapId?: string
} & Partial<MapProps>

export function GMap({
    children,
    mapTypeId = 'terrain',
    mapId = defaultMapId,
    ...mapProps
}: React.PropsWithChildren<Props>) {
    // Early return or error handling if API key is missing
    if (!apiKey) {
        console.error('Missing env var: NEXT_PUBLIC_GMAPS_KEY')
        return <div>Google Maps cannot be loaded. Please check the console for more information.</div>
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                {...mapProps}
                mapId={mapId}
                mapTypeId={mapTypeId} // enum google.maps.MapTypeId
                // onTilesLoaded can be omitted if no specific action is required on tiles loaded
            >
                {children}
            </Map>
        </APIProvider>
    )
}
