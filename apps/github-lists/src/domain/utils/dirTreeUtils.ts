import { GhTreeItem } from '@qolt/data-github'

const SYMBOLS = {
    BRANCH: '├── ',
    LAST_BRANCH: '└── ',
    VERTICAL: '│   ',
    SPACE: '    ',
} as const

export interface DirTree {
    path: string
    name: string
    children?: DirTree[]
}

export function gitTreeToDirectoryTree(gitTree: GhTreeItem[]): DirTree {
    const sortedTree = [...gitTree].sort((a, b) => a.path.localeCompare(b.path))

    function buildTree(items: GhTreeItem[], parentPath: string = ''): DirTree[] {
        return items
            .filter((item) => {
                const itemPath = item.path
                return (
                    itemPath.startsWith(parentPath) &&
                    (parentPath === '' || itemPath.slice(parentPath.length).split('/').filter(Boolean).length === 1)
                )
            })
            .map((item) => {
                const name = item.path.slice(parentPath.length).split('/').filter(Boolean)[0]
                const path = parentPath ? `${parentPath}/${name}` : name
                const children = buildTree(items, path)

                return {
                    path,
                    name,
                    ...(children.length > 0 ? { children } : {}),
                }
            })
    }

    const result = buildTree(sortedTree)
    return { path: '', name: '', children: result }
}

export function dirTreeToAnsi(node: DirTree, prefix = '', isLast = true): string {
    let result = ''

    // Add current node
    result += prefix
    result += isLast ? SYMBOLS.LAST_BRANCH : SYMBOLS.BRANCH
    result += node.name + (node.children ? '/' : '') + '\n'

    // Process children
    if (node.children) {
        const sortedChildren = [...node.children].sort((a, b) => {
            // Directories first, then alphabetical
            if (a.children && !b.children) return -1
            if (!a.children && b.children) return 1
            return a.name.localeCompare(b.name)
        })

        sortedChildren.forEach((child, index) => {
            const isChildLast = index === sortedChildren.length - 1
            const newPrefix = prefix + (isLast ? SYMBOLS.SPACE : SYMBOLS.VERTICAL)
            result += dirTreeToAnsi(child, newPrefix, isChildLast)
        })
    }

    return result
}

export function parseAnsiToDirectoryTree(input: string): DirTree {
    const lines = input.trim().split('\n')
    const root: DirTree = { path: '', name: 'root', children: [] }
    const stack: { level: number; node: DirTree }[] = [{ level: -1, node: root }]

    lines.forEach((line) => {
        const match = line.match(new RegExp(`^(${SYMBOLS.SPACE}|${SYMBOLS.VERTICAL})*(.+)$`))
        if (!match) return

        const [, indent, content] = match
        const level = (indent?.length ?? 0) / SYMBOLS.SPACE.length
        const name = content.replace(new RegExp(`^${SYMBOLS.BRANCH}|^${SYMBOLS.LAST_BRANCH}`), '').replace(/\/$/, '')
        const isDirectory = content.endsWith('/')

        const node: DirTree = {
            name,
            path: '', // We don't have the full path information from the ANSI representation
            children: isDirectory ? [] : undefined,
        }

        while (stack.length > level + 1) {
            stack.pop()
        }

        const parent = stack[stack.length - 1].node
        parent.children?.push(node)

        if (isDirectory) {
            stack.push({ level, node })
        }
    })

    return root.children?.[0] ?? root // Return the first child as the root, or root if it's empty
}

export function directoryTreeToPlusMinus(node: DirTree, level = 0): string {
    const indent = '  '.repeat(level)
    const prefix = node.children ? '+' : '-'
    let result = `${indent}${prefix} ${node.name}\n`

    if (node.children) {
        node.children.forEach((child) => {
            result += directoryTreeToPlusMinus(child, level + 1)
        })
    }

    return result
}
export interface DirTree {
    name: string
    path: string
    children?: DirTree[]
}

export function parsePlusMinusToDirectoryTree(input: string): DirTree {
    const lines = input.trim().split('\n')

    const root: DirTree = { path: '', name: 'root', children: [] }
    const stack: { level: number; node: DirTree }[] = [{ level: -1, node: root }]

    lines.forEach((line) => {
        const match = line.match(/^(\s*)([+-])\s(.+)$/)
        if (!match) return

        const [, indent, prefix, name] = match
        const level = indent.length / 2
        const isDirectory = prefix === '+'

        const node: DirTree = {
            name: name.trim(),
            path: '',
            children: isDirectory ? [] : undefined,
        }

        while (stack.length > level + 1) {
            stack.pop()
        }

        const parent = stack[stack.length - 1].node
        parent.children!.push(node)

        // Update the path
        node.path = parent.path ? `${parent.path}/${node.name}` : node.name

        if (isDirectory) {
            stack.push({ level, node })
        }
    })

    return root.children![0] ?? root
}
