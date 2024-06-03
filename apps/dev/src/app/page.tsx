import { Card, Divider, List, Stack, Typography } from '@mui/joy'
import { getApps } from '../domain/utils/monorepoData'

import monorepoNpms from '../../monorepo-npms.json'

import * as Linktree from 'domain/Linktree'
import AppCards, { DependencyList } from 'domain/AppCards'

export default async function Page() {
    const root = monorepoNpms.root
    const apps = getApps(monorepoNpms.workspaces)

    return (
        <Stack gap={2} p={2}>
            <Card size="lg" variant="outlined">
                <Typography level="h1">{root.name.toUpperCase()}</Typography>
                <Divider inset="none" />
                {/* 
                <List
                    variant="outlined"
                    size="sm"
                    sx={{
                        width: "100%",
                        borderRadius: "sm",
                    }}
                >
                    <DependencyList dependencies={root.dependencies}>Dependencies</DependencyList>
                    <DependencyList dependencies={root.devDependencies}>DevDependencies</DependencyList>
                </List> */}
            </Card>

            <AppCards apps={apps} />
            {process.env.LINKTREE_USER && <Linktree.Account user={process.env.LINKTREE_USER} />}
        </Stack>
    )
}
