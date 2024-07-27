import { GhTreeItem } from '@qolt/data-github'
import {
    directoryTreeToPlusMinus,
    DirTree,
    dirTreeToAnsi,
    gitTreeToDirectoryTree,
    parseAnsiToDirectoryTree,
    parsePlusMinusToDirectoryTree,
} from 'domain/utils/dirTreeUtils'
import React from 'react'

/** Input types for tree data */
export enum InputType {
    ANSI = 'ansi',
    PLUS_MINUS = 'plusMinus',
    DIR_TREE = 'dirTree',
    GIT_TREE = 'gitTree',
}

/** Render modes for the tree */
export enum RenderMode {
    ANSI = 'ansi',
    PLUS_MINUS = 'plusMinus',
}

type Props = React.PropsWithChildren<{
    /** Pre-processed DirTree object */
    dirTree?: DirTree
    /** Type of input when using children */
    inputType?: InputType
    /** Mode to render the tree */
    renderMode: RenderMode
    /** Maximum number of levels to display */
    levels?: number
}>

/**
 * DirTreeRenderer component for displaying directory trees
 *
 * @example
 * // Using dirTree prop
 * <DirTreeRenderer dirTree={myDirTree} renderMode={RenderMode.ANSI} />
 *
 * @example
 * // Using children with inputType
 * <DirTreeRenderer inputType={InputType.ANSI} renderMode={RenderMode.PLUS_MINUS}>
 *   ├── src/
 *   │   ├── components/
 *   │   └── utils/
 *   └── package.json
 * </DirTreeRenderer>
 */
export const DirTreeRenderer: React.FC<Props> = ({
    dirTree: _dirTree,
    inputType = InputType.ANSI,
    renderMode,
    levels,
    children,
}) => {
    let dirTree: DirTree

    if (_dirTree) {
        dirTree = _dirTree
    } else if (children) {
        const childrenContent = extractStringChildren(children)
        dirTree = convertToDirTree(childrenContent, inputType)
    } else {
        throw new Error('Either dirTree prop or children must be provided')
    }

    const renderTree = () => {
        let renderedTree: string
        switch (renderMode) {
            case RenderMode.ANSI:
                renderedTree = dirTreeToAnsi(dirTree)
                break
            case RenderMode.PLUS_MINUS:
                renderedTree = directoryTreeToPlusMinus(dirTree)
                break
            default:
                throw new Error('Invalid render mode')
        }

        // Apply levels limit if specified
        if (levels !== undefined) {
            renderedTree = renderedTree.split('\n').slice(0, levels).join('\n')
        }

        return <pre>{renderedTree}</pre>
    }

    return <>{renderTree()}</>
}

/**
 * Converts different input types to DirTree
 *
 * @param input - The input data (string, DirTree, or GhTreeItem[])
 * @param inputType - The type of the input data
 * @returns A DirTree object
 *
 * @example
 * const myDirTree = convertToDirTree(ansiString, InputType.ANSI)
 */
export const convertToDirTree = (input: string | DirTree | GhTreeItem[], inputType: InputType): DirTree => {
    if (typeof input === 'object' && !Array.isArray(input)) {
        return input as DirTree // Already a DirTree object
    }

    const inputString = typeof input === 'string' ? input : JSON.stringify(input)

    switch (inputType) {
        case InputType.ANSI:
            return parseAnsiToDirectoryTree(inputString)
        case InputType.PLUS_MINUS:
            return parsePlusMinusToDirectoryTree(inputString)
        case InputType.DIR_TREE:
            return JSON.parse(inputString)
        case InputType.GIT_TREE:
            return gitTreeToDirectoryTree(JSON.parse(inputString))
        default:
            throw new Error('Invalid input type')
    }
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
