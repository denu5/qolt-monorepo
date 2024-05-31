'use client'

import { formatDistanceToNow, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'

type Props = {
    value: string
}

export function DateTimeAgo({ value }: Props) {
    const [formattedDate, setFormattedDate] = useState<string>()

    useEffect(() => {
        setFormattedDate(formatDistanceToNow(parseISO(value)))
    }, [value])

    return <time dateTime={value}>{formattedDate} ago</time>
}
