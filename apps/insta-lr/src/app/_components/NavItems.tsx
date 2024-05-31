import CameraIcon from '@mui/icons-material/CameraRounded'
import ExploreIcon from '@mui/icons-material/ExploreRounded'
import HomeIcon from '@mui/icons-material/HomeRounded'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideoRounded'
import { List, ListItem } from '@mui/joy'
import { AppRoot } from '@qolt/app-components'
import { ColorSchemeToggleButton } from '@qolt/app-components/_client'

export const Primary = () => (
    <List sx={{ '--ListItem-radius': '12px', '--List-gap': '32px' }} role="menubar">
        <AppRoot.LeftRailLink Icon={HomeIcon} href="/" text="Home" />
        <AppRoot.LeftRailLink Icon={ExploreIcon} href="/explore" text="Explore" />
        <AppRoot.LeftRailLink Icon={CameraIcon} href="/albums" text="Photos" />
        <AppRoot.LeftRailLink Icon={OndemandVideoIcon} href="/vids" text="Videos" />
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
    </List>
)
