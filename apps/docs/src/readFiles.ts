import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import glob from 'glob'

const globPromise = (pattern: string, options: glob.IOptions): Promise<string[]> =>
    new Promise((resolve, reject) => {
        glob(pattern, options, (err, files: string[]) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })

const readFiles = async <T>(rootDir: string, pattern: string, options: glob.IOptions) => {
    try {
        const files = await globPromise(pattern, options)
        const contents = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(rootDir, file)
                const content = await fs.readFile(filePath, 'utf8')
                return {
                    path: file,
                    content: JSON.parse(content) as T,
                }
            }),
        )
        return contents
    } catch (err) {
        throw new Error(`Error reading files: ${String(err)}`)
    }
}

type PackageJson = {
    name: string
    description: string
    license: string // TODO figure out license type
    scripts: {
        dev: string
    }
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
}

export const readPackageJsons = () => {
    const repoRoot = '../../../'
    const repoRootDirName = path.resolve(path.dirname(fileURLToPath(import.meta.url)), repoRoot)
    return readFiles<PackageJson>(repoRootDirName, '**/package.json', {
        cwd: repoRootDirName,
        ignore: '**/node_modules/**',
    })
}

// Function to parse the port from a script command
const parsePort = (devScript: string): number => {
    const match = devScript.match(/--port (\d+)/)
    return match ? parseInt(match[1], 10) : 3000 // Default to 3000 if no port is specified
}

// Function to get the development URL from a parsed package.json object
export const getDevUrl = (packageJson: PackageJson): string => {
    const devScript = packageJson.scripts.dev

    if (!devScript) {
        throw new Error("No 'dev' script found in package.json")
    }

    const port = parsePort(devScript)
    return `http://localhost:${port}`
}
