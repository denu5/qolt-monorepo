import * as Extractors from './extractors'

import { IDependencyExtractor } from './IDependencyExtractor'

const extractorMap: Record<string, new () => IDependencyExtractor> = {
    JavaScript: Extractors.JavaScriptDependencyExtractor,
    TypeScript: Extractors.JavaScriptDependencyExtractor,
    Python: Extractors.PythonDependencyExtractor,
    'C#': Extractors.CSharpDependencyExtractor,
    'F#': Extractors.FSharpDependencyExtractor,
}

const extractorInstances: Record<string, IDependencyExtractor> = {}

export function getDependencyExtractor(language: string): IDependencyExtractor {
    if (!extractorInstances[language]) {
        const ExtractorClass = extractorMap[language]
        if (!ExtractorClass) {
            throw new Error(`No dependency extractor found for language: ${language}`)
        }
        extractorInstances[language] = new ExtractorClass()
    }
    return extractorInstances[language]
}

// // Usage in API route handler
// import { getDependencyExtractor } from '../lib/dependencyExtractors';

// // ... in your API route handler
// const extractor = getDependencyExtractor(primaryLanguage);
// const dependencies = await findDependencies(apiUrl, directoryTree, extractor);

// async function findDependencies(apiUrl: string, tree: DirectoryTree, extractor: any): Promise<Dependency[]> {
//     const configFiles = extractor.getConfigFiles();
//     const dependencies: Dependency[] = [];

//     async function searchTree(node: DirectoryTree) {
//       if (configFiles.some(file => node.name.endsWith(file))) {
//         const content = await getGithubRepoContents(apiUrl, node.path);
//         const fileContent = Buffer.from(content.content, 'base64').toString();
//         const extractedDeps = extractor.extractDependencies(fileContent, node.name);
//         dependencies.push(...extractedDeps);
//       }

//       if (node.children) {
//         for (const child of node.children) {
//           await searchTree(child);
//         }
//       }
//     }

//     await searchTree(tree);
//     return dependencies;
//   }
