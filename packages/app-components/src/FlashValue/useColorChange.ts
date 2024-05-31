import { useEffect, useState } from 'react'

type ChangeableProperty = 'color' | 'background-color'

const USE_COLOR_CHANGE_ID = '__use_color_change'

const insertStyleSheetRule = (ruleText: string): void => {
    let style = document.getElementById(USE_COLOR_CHANGE_ID) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement('style')
        style.id = USE_COLOR_CHANGE_ID
        document.head.appendChild(style)
    }
    style.sheet?.insertRule(ruleText, style.sheet.cssRules.length)
}

const makeAnimation = (color: string, property: ChangeableProperty): string => {
    const random = `use-color-change-${String(Math.random()).replace(/\./g, '')}`
    const animation = `@keyframes ${random} { from {${property}: ${color};} to {} }`
    insertStyleSheetRule(animation)
    return random
}
const [higherColor, lowerColor, changeColor] = ['rgb(255 0 0 / 20%)', 'rgb(0 255 0 / 20%)', 'hsl(289, 60%, 92%)']

export const useColorChange = (
    value: number | string,
    {
        higher = higherColor,
        lower = lowerColor,
        change = changeColor,
        duration = 1800,
        property = 'color',
        flashTrend = false,
    }: {
        higher?: string
        lower?: string
        change?: string
        flashTrend?: boolean
        duration?: number
        property?: ChangeableProperty
    },
): { animation?: string } => {
    const [previousValue, setPreviousValue] = useState(value)
    const [animation, setAnimation] = useState('')

    useEffect(() => {
        if (value === previousValue) return

        let animationColor = null // Default to null if no conditions are met

        if (flashTrend) {
            if (value > previousValue) {
                animationColor = higher
            } else if (value < previousValue) {
                animationColor = lower
            }
            // If value equals previousValue, animationColor remains null
        } else {
            animationColor = change
        }

        if (animationColor) setAnimation(makeAnimation(animationColor, property))

        setPreviousValue(value)
    }, [value, previousValue, change, flashTrend, higher, lower, property])

    return animation ? { animation: `${animation} ${String(duration / 1000)}s ease-in-out 1` } : {}
}
