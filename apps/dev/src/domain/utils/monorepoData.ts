export type PackageJson = {
    name: string
    description: string
    license: string
    scripts: {
        dev: string
    }
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    __metaData: Record<string, unknown>
}

export const getApps = (workspaces: Record<'apps' | 'packages', unknown>) => {
    const workspaceApps = workspaces.apps as PackageJson[]
    const apps = workspaceApps
        .map((p) => ({ ...p, ...{ __metaData: { devUrl: getDevUrl(p) } } }))
        .toSorted((a, b) => a.__metaData.devUrl.localeCompare(b.__metaData.devUrl))

    return apps
}

export type AppType = ReturnType<typeof getApps>[0]

const getDevUrl = (packageJson: PackageJson): string => {
    const parsePort = (devScript: string): number => {
        const match = devScript.match(/--port (\d+)/)
        return match ? parseInt(match[1], 10) : 3000 // Default to 3000 if no port is specified
    }

    const devScript = packageJson.scripts.dev //   "dev": "next dev --port 3001",

    if (!devScript) {
        throw new Error("No 'dev' script found in package.json")
    }

    const port = parsePort(devScript)
    return `http://localhost:${port}`
}
