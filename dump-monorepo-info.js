const fs = require('fs')
const path = require('path')

// Ensure the output directory is provided as a command-line argument
if (process.argv.length < 3) {
    console.error('Please provide the output file path as an argument.')
    process.exit(1)
}

const projectRoot = process.cwd()
const outputFilePath = path.resolve(path.join(projectRoot, process.argv[2]))

// Function to read workspaces from the root package.json
const getWorkspaces = () => {
    const rootPackageJsonPath = path.join(projectRoot, 'package.json')
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'))

    return {
        root: rootPackageJson,
        workspaces: rootPackageJson.workspaces || [],
    }
}

const readPackageJsonFile = async (dir) => {
    const packageJsonPath = path.join(dir, 'package.json')

    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        return packageJson
    }

    return null
}

const processDirectories = async (baseDir) => {
    const subdirs = await fs.promises.readdir(baseDir)
    const packageJsons = []

    for (const subdir of subdirs) {
        const subdirPath = path.join(baseDir, subdir)
        const stat = await fs.promises.stat(subdirPath)

        if (stat.isDirectory()) {
            const packageJson = await readPackageJsonFile(subdirPath)
            if (packageJson) {
                packageJsons.push(packageJson)
            }
        }
    }

    return packageJsons
}

const run = async () => {
    try {
        // Ensure the output directory exists
        const outputDir = path.dirname(outputFilePath)
        if (!fs.existsSync(outputDir)) {
            await fs.promises.mkdir(outputDir, { recursive: true })
        }

        // Get root and workspaces from the root package.json
        const { root, workspaces } = getWorkspaces()

        const workspaceData = {}

        for (const workspace of workspaces) {
            const baseDirPattern = workspace.replace('/*', '')
            const workspaceBaseDir = path.join(projectRoot, baseDirPattern)
            const packageJsons = await processDirectories(workspaceBaseDir)

            const workspaceKey = path.basename(baseDirPattern)
            if (!workspaceData[workspaceKey]) {
                workspaceData[workspaceKey] = []
            }

            workspaceData[workspaceKey].push(...packageJsons)
        }

        const result = { root, workspaces: workspaceData }

        fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2))
        console.log(`All package.json files have been written to ${outputFilePath}`)
    } catch (error) {
        console.error('Error:', error)
    }
}

run()
