import React from 'react'
import {
    parseTreeUnix,
    parseTreeNodeJson,
    parseTreePlusMinus,
    renderTreeUnix,
    renderTreeNodeJson,
    renderTreePlusMinus,
} from './TreeNode'

type TreeNode = {
    name: string
    children: TreeNode[]
}

type Props = React.PropsWithChildren<{
    inputMode: 'treeUnix' | 'treeNodeJson' | 'treePlusMinus'
    renderMode: 'treeUnix' | 'treeNodeJson' | 'treePlusMinus'
    levels?: number
    treeData?: string // interchangeable with children
}>

export const ProjectTree = ({ inputMode, renderMode, levels, children, treeData }: Props) => {
    const data = treeData || extractStringChildren(children)

    if (!data) throw new Error('no data')

    let tree: TreeNode[] = []

    switch (inputMode) {
        case 'treeUnix':
            tree = parseTreeUnix(data)
            break
        case 'treeNodeJson':
            tree = parseTreeNodeJson(data)
            break
        case 'treePlusMinus':
            tree = parseTreePlusMinus(data)
            break
    }

    if (!tree) throw new Error('no tree')

    const renderTree = () => {
        switch (renderMode) {
            case 'treeUnix':
                return renderTreeUnix(tree)
            case 'treeNodeJson':
                return renderTreeNodeJson(tree)
            case 'treePlusMinus':
                return renderTreePlusMinus(tree)
            default:
                return null
        }
    }

    return <>{renderTree()}</>
}

const extractStringChildren = (children: React.ReactNode): string => {
    return React.Children.toArray(children)
        .map((child) => {
            if (typeof child === 'string') {
                return child
            }
            if (React.isValidElement(child)) {
                if (child.props.children.type === 'code') {
                    return String(child.props.children.props.children)
                }

                if (child.props.children.type === 'ul') {
                    return String(child.props.children.props.children)
                }

                return String(child.props.children)
            }
            return ''
        })
        .join('')
}
