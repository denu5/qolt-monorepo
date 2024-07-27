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

export interface GitTreeItem {
    path: string
    mode: string
    type: 'blob' | 'tree'
    sha: string
    size?: number
    url: string
}

export function gitTreeToDirectoryTree(gitTree: GitTreeItem[]): DirTree {
    const root: DirTree = { path: '', name: '', children: [] }
    const map = new Map<string, DirTree>()

    gitTree.forEach((item) => {
        const parts = item.path.split('/')
        let currentPath = ''
        let currentNode = root

        parts.forEach((part, index) => {
            currentPath += (index > 0 ? '/' : '') + part
            if (!map.has(currentPath)) {
                const newNode: DirTree = { path: currentPath, name: part }
                if (item.type === 'tree' || index < parts.length - 1) {
                    newNode.children = []
                }
                map.set(currentPath, newNode)
                currentNode.children!.push(newNode)
            }
            currentNode = map.get(currentPath)!
        })
    })

    return root.children![0] // Return the top-level directory
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
            name,
            path: '', // We don't have the full path information from the plus-minus representation
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
