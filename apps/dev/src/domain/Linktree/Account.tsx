import * as React from 'react'
import { Box, List, Divider, ListDivider } from '@mui/joy'
import { LinkEntry } from './LinkEntry'
import { fetchNextData } from 'domain/utils/readNextData'
import { LinktreePageProps } from './types'
import { AccountHeader } from './AccountHeader'

type Props = {
    user?: string
}

export const Account = async ({ user }: React.PropsWithChildren<Props>) => {
    if (!user) {
        throw new Error('linktree user props not specified')
    }

    const { props } = await fetchNextData<{ pageProps: LinktreePageProps }>(`https://linktr.ee/${user}`)
    const { account } = props.pageProps

    return (
        <Box p={2}>
            <AccountHeader account={account} />
            <Divider sx={{ my: 2 }} />
            <List sx={{ mb: 2 }} variant="outlined">
                {account.links.map((l, k) => (
                    <React.Fragment key={l.id}>
                        {k > 0 && <ListDivider inset="gutter" />}
                        <LinkEntry link={l} hideThumbnail />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    )
}
