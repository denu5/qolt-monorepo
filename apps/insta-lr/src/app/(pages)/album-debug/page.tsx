'use client'

import React, { useState } from 'react'
import { fetchData } from './actions'

import { type SharesConfig } from 'domain/lib/lightroom-api'

export default function Page() {
    const [data, setData] = useState<SharesConfig>({})
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const url = formData.get('shareUrl') as string

        try {
            const result = await fetchData(url)
            setData(result)
            setError(null)
        } catch (error: any) {
            setError(error.message)
            setData({})
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="shareUrl" placeholder="Enter albumShareUrl" />
                <button type="submit">Fetch Data</button>
            </form>

            {error && <div>Error: {error}</div>}

            {!error && data && (
                <div>
                    <h1>Album Config</h1>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
