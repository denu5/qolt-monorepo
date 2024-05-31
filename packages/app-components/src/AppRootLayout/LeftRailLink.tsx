import { ListItem, ListItemButton, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import Link from 'next/link'

type NavItemProps = {
    href: string
    ariaLabel?: string
    Icon: JSX.ElementType
    text: string
    selected?: boolean
}

export function LeftRailLink({ href, ariaLabel, Icon, text, selected = false }: NavItemProps) {
    return (
        <ListItem>
            <ListItemButton
                role="menuitem"
                component={Link}
                href={href}
                aria-label={ariaLabel ?? text}
                selected={selected}
            >
                <Icon sx={{ width: 24, height: 24, color: 'text.primary' } as SxProps} />
                <Typography
                    sx={{
                        bottom: '-18px',
                        color: 'text.primary',
                        position: 'absolute',
                        fontSize: '11px',
                        textAlign: 'center',
                        left: '-4px',
                        right: '-4px',
                    }}
                >
                    {text}
                </Typography>
            </ListItemButton>
        </ListItem>
    )
}
