import { Box, Table } from '@mui/joy'

import { getDevUrl, readPackageJsons } from '../readFiles'

export default async function Page() {
    const pkgs = await readPackageJsons()
    const apps = pkgs.flatMap((pkg) =>
        pkg.path.startsWith('apps/') ? { ...pkg.content, devUrl: getDevUrl(pkg.content) } : [],
    )
    apps.sort((a, b) => a.devUrl.localeCompare(b.devUrl))

    return (
        <Box>
            <Table>
                <thead>
                    <tr>
                        <th>App</th>
                        <th>Dependencies</th>
                    </tr>
                </thead>
                <tbody>
                    {apps.map((p) => (
                        <tr key={p.name}>
                            <td>
                                <ul>
                                    <li>{p.name}</li>
                                    <li>{p.description}</li>
                                    <li>
                                        <a target="blank" href={p.devUrl}>
                                            {p.devUrl}
                                        </a>
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <pre>{JSON.stringify(p.dependencies, null, 2)}</pre>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>
    )
}
