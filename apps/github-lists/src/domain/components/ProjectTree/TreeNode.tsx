type TreeNode = {
    name: string
    children: TreeNode[]
}

export const parseTreeUnix = (input: string): TreeNode[] => {
    const lines = input?.trim().split('\n')
    const tree: TreeNode[] = []
    const stack: { level: number; node: TreeNode }[] = [{ level: 0, node: { name: '', children: tree } }]

    lines.forEach((line) => {
        const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4
        const name = line
            .trim()
            .replace(/^[├──│─]+/, '')
            .trim()
        const node: TreeNode = { name, children: [] }

        while (stack.length > level + 1) {
            stack.pop()
        }

        stack[level].node.children.push(node)
        stack[level + 1] = { level: level + 1, node }
    })

    return tree
}

export const parseTreeNodeJson = (input: string): TreeNode[] => {
    return JSON.parse(input)
}

export const parseTreePlusMinus = (input: string): TreeNode[] => {
    const lines = input.trim().split('\n')
    const root: TreeNode[] = []
    const stack: { level: number; node: TreeNode }[] = [{ level: -1, node: { name: '', children: root } }]

    lines.forEach((line) => {
        const trimmed = line.trim()
        const level = (line.match(/^(\s*)/)?.[0].length ?? 0) / 2
        const isFolder = trimmed.startsWith('+')
        const name = trimmed.replace(/^[-+]\s*/, '')

        const node: TreeNode = { name, children: [] }

        while (stack.length > level + 1) {
            stack.pop()
        }

        stack[stack.length - 1].node.children.push(node)

        if (isFolder) {
            stack.push({ level, node })
        }
    })

    return root
}

const convertTreeNodesToUnix = (nodes: TreeNode[], level = 0): string => {
    return nodes
        .map((node) => {
            const indent = ' '.repeat(level * 4)
            const childrenUnix = convertTreeNodesToUnix(node.children, level + 1)
            return `${indent}├── ${node.name}\n${childrenUnix}`
        })
        .join('')
}

const convertTreeNodesToPlusMinus = (nodes: TreeNode[], level = 0): string => {
    return nodes
        .flatMap((node) => {
            const indent = '  '.repeat(level)
            const childrenPlusMinus = convertTreeNodesToPlusMinus(node.children, level + 1)
            const prefix = node.children.length ? '+' : '-'
            return [`${indent}${prefix} ${node.name}`, ...childrenPlusMinus]
        })
        .join('\n')
}

export const renderTreeNodeJson = (nodes: TreeNode[]): React.ReactNode => {
    return <pre>{JSON.stringify(nodes, null, 2)}</pre>
}

export const renderTreeUnix = (nodes: TreeNode[]): React.ReactNode => {
    const unixString = convertTreeNodesToUnix(nodes)
    return <pre>{unixString}</pre>
}

export const renderTreePlusMinus = (nodes: TreeNode[]): React.ReactNode => {
    const plusMinusString = convertTreeNodesToPlusMinus(nodes)
    return <pre>{plusMinusString}</pre>
}
