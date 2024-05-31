import { fetchAndProcessAlbumImages, fetchLightroomAlbum } from 'domain/lib/lightroom-api'
import { notFound } from 'next/navigation'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { searchParams } = new URL(request.url)
    const processed = searchParams.get('processed')

    if (processed) {
        const lightRoomRes = await fetchAndProcessAlbumImages(params.id)
        if (!lightRoomRes) return notFound()

        return Response.json({ data: lightRoomRes })
    }

    const [space, album] = params.id.split('.')

    const lightRoomRes = await fetchLightroomAlbum(space, album)
    if (!lightRoomRes) return notFound()

    return Response.json({ data: lightRoomRes })
}
