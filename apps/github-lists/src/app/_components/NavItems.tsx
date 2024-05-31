import BookmarksIcon from '@mui/icons-material/BookmarksRounded'
import HomeIcon from '@mui/icons-material/HomeRounded'
import SettingsIcon from '@mui/icons-material/SettingsRounded'
import StarIcon from '@mui/icons-material/StarRounded'
import { List, ListItem, ListItemButton } from '@mui/joy'
import { AppRoot } from '@qolt/app-components'
import { ColorSchemeToggleButton } from '@qolt/app-components/_client'

export const Primary = () => (
    <List sx={{ '--ListItem-radius': '12px', '--List-gap': '32px' }} role="menubar">
        <AppRoot.LeftRailLink Icon={HomeIcon} href="/" text="Home" />
        <AppRoot.LeftRailLink Icon={StarIcon} href="/g" text="Github" />
        <AppRoot.LeftRailLink Icon={BookmarksIcon} href="/links" text="Links" />
    </List>
)

export const Secondary = () => (
    <List
        sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': '8px',
            '--List-gap': '8px',
        }}
    >
        <ListItem>
            <ColorSchemeToggleButton />
        </ListItem>
        <ListItem>
            <ListItemButton>
                <SettingsIcon />
            </ListItemButton>
        </ListItem>
    </List>
)
