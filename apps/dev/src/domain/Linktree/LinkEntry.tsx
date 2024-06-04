import * as React from 'react'
import { Box, Typography, Link as MuiLink, List, ListItem, ListItemContent, ListItemDecorator } from '@mui/joy'
import { LinktreeLinkEntry } from './types'

interface LinkCardProps {
    link: LinktreeLinkEntry
    hideThumbnail?: boolean
}

export const LinkEntry: React.FC<LinkCardProps> = ({ link, hideThumbnail }) => {
    if (link.type === 'HEADER') {
        return (
            <ListItem>
                <Typography level="title-lg" id={`header-${link.id}`} mt={1}>
                    {link.title}
                </Typography>
            </ListItem>
        )
    }

    return (
        <ListItem>
            {!hideThumbnail && link.modifiers?.thumbnailUrl && (
                <ListItemDecorator>
                    <img
                        src={link.modifiers.thumbnailUrl}
                        alt={link.title}
                        style={{ width: 48, height: 48, marginRight: 16 }}
                    />
                </ListItemDecorator>
            )}
            <ListItemContent>
                <MuiLink href={link.url} target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
                    <Typography level="title-md">{link.title}</Typography>
                </MuiLink>
            </ListItemContent>
        </ListItem>
    )
}
