import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardActions from '@mui/joy/CardActions'
import Divider from '@mui/joy/Divider'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Typography from '@mui/joy/Typography'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { AppType } from './utils/monorepoData'
import { ListItemButton, ListSubheader, Stack } from '@mui/joy'

export default function AppCards({ apps }: { apps: AppType[] }) {
    return (
        <Stack gap={2}>
            {apps.map((app) => (
                <Card key={app.name} size="lg" variant="outlined">
                    <Typography level="title-lg">{app.name.toUpperCase()}</Typography>
                    <Divider inset="none" />
                    <Typography level="title-md">{app.description?.split('•')[0]}</Typography>
                    <Typography>{app.description?.split('•')[1]}</Typography>
                    <List
                        variant="outlined"
                        size="sm"
                        sx={{
                            width: '100%',
                            borderRadius: 'sm',
                        }}
                    >
                        <DependencyList dependencies={app.dependencies}>Dependencies</DependencyList>
                        <DependencyList dependencies={app.devDependencies}>DevDependencies</DependencyList>
                    </List>
                    <CardActions>
                        <Button
                            variant="soft"
                            color="neutral"
                            href={app.__metaData.devUrl}
                            endDecorator={<KeyboardArrowRight />}
                        >
                            {app.__metaData.devUrl.split('//')[1]}
                        </Button>
                        <Button variant="soft" color="primary" href="#" endDecorator={<KeyboardArrowRight />}>
                            Demo
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Stack>
    )
}

export const DependencyList = ({
    dependencies,
    children,
}: React.PropsWithChildren<{ dependencies: Record<string, string> }>) => (
    <ListItem nested>
        <ListSubheader>{children}</ListSubheader>
        <List>
            {Object.entries(dependencies).map(([p, v]) => (
                <ListItem key={p}>
                    {v !== '*' ? (
                        <ListItemButton
                            component="a"
                            href={`https://www.npmjs.com/package/${p}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {`${p}: ${v}`}
                        </ListItemButton>
                    ) : (
                        <>{`${p}: ${v}`}</>
                    )}
                </ListItem>
            ))}
        </List>
    </ListItem>
)
