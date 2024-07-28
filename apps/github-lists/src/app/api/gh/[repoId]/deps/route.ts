import {
    GhAnalysys,
    GhRepoBase,
    getGhRepoBase,
    getGithubFullTree,
    getGithubRepo,
    getGithubRepoContents,
} from '@qolt/data-github'
import { convertSBOMToDependencies, getDependencyExtractor } from 'domain/utils/depExtractors'
import { IDependency } from 'domain/utils/depExtractors/IDependencyExtractor'
import { DirTree, gitTreeToDirectoryTree } from 'domain/utils/dirTreeUtils'
import { toGithubRepoId } from 'domain/utils/repoIdConverter'

async function extractDependenciesFromFiles(
    repo: GhRepoBase,
    tree: DirTree,
    language: string | undefined,
    maxDepth: number = 100,
): Promise<IDependency[]> {
    if (!language) {
        console.warn(`No language specified for repo ${repo.full_name}. Skipping file-based dependency extraction.`)
        return []
    }

    const extractor = getDependencyExtractor(language)
    const fileDependencies: IDependency[] = []
    const processedPaths = new Set<string>()

    async function searchTree(node: DirTree, depth: number): Promise<void> {
        if (depth > maxDepth) {
            console.warn(`Max depth reached for path ${node.path}. Stopping recursion.`)
            return
        }

        if (processedPaths.has(node.path)) {
            console.warn(`Circular reference detected for path ${node.path}. Skipping.`)
            return
        }

        processedPaths.add(node.path)

        if (extractor.getConfigFiles().some((file) => node.name.endsWith(file))) {
            try {
                console.log(`Processing file: ${node.path}`)
                const fileContent = await getGithubRepoContents(repo, node.path)
                const decodedContent = Buffer.from(fileContent.content, 'base64').toString()
                const extractedDeps = extractor.extractDependencies(decodedContent, node.name)
                fileDependencies.push(...extractedDeps)
            } catch (error) {
                console.error(`Error processing file ${node.path}:`, error)
            }
        }

        if (node.children) {
            for (const child of node.children) {
                await searchTree(child, depth + 1)
            }
        }
    }

    await searchTree(tree, 0)
    return fileDependencies
}

export async function GET(_: Request, { params }: { params: { repoId: string } }) {
    try {
        const repo = getGhRepoBase(toGithubRepoId(params.repoId))
        const repoDetails = await getGithubRepo(repo)

        const fullTree = await getGithubFullTree(repo)
        const tree = gitTreeToDirectoryTree(fullTree)
        const parsedTreeDeps = await extractDependenciesFromFiles(repo, tree, repoDetails.language)

        const sbomResponse = await GhAnalysys.getSBOM(repo)
        const sbomDeps: IDependency[] = convertSBOMToDependencies(sbomResponse.sbom)


        const dependencyData = {
            fileDependencies: {
                count: parsedTreeDeps.length,
                dependencies: parsedTreeDeps,
            },
            apiDependencies: {
                count: sbomDeps.length,
                dependencies: sbomDeps,
            },
        }

        return Response.json({
            dependencies: dependencyData,
            data: repoDetails,
        })
    } catch (error) {
        console.error('Error in GET function:', error)
        return Response.json({ error: 'An error occurred while processing the request' }, { status: 500 })
    }
}
