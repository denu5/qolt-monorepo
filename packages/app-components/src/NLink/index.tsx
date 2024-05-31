'use client'

import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import { forwardRef, useEffect } from 'react'

import { shouldTriggerStartEvent } from './should-trigger-start-event'

export const NLink = forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(function Link(
    { href, onClick, ...rest },
    ref,
) {
    const useLink = href?.startsWith('/')
    if (!href)
        return (
            <a href="#" onClick={onClick} {...rest}>
                no href
            </a>
        )

    if (!useLink) return <a href={href} onClick={onClick} {...rest} />

    return (
        <NextLink
            href={href}
            onClick={(event) => {
                if (shouldTriggerStartEvent(href, event)) NProgress.start()
                if (onClick) onClick(event)
            }}
            {...rest}
            ref={ref}
        />
    )
})

export function NProgressDone() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    useEffect(() => {
        NProgress.done()
    }, [pathname, searchParams])
    return <></>
}
