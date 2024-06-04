import * as React from 'react'
import { Box, Typography, Avatar } from '@mui/joy'
import { LinktreeAccount } from './types'

export const AccountHeader = ({ account }: React.PropsWithChildren<{ account: LinktreeAccount }>) => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Avatar src={account.profilePictureUrl} alt={account.username} sx={{ width: 80, height: 80, mb: 2 }} />
            <Typography level="h3" gutterBottom>
                @{account.username}
            </Typography>
            <Typography gutterBottom>{account.description}</Typography>
        </Box>
    )
}
