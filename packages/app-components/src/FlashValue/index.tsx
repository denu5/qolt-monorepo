import { useColorChange } from './useColorChange'

export const FlashNumber = ({ value }: { value: number }) => {
    const colorStyle = useColorChange(value, {
        duration: 2000,
        flashTrend: true,
        property: 'background-color',
    })

    return <span style={colorStyle}>{value.toFixed(6)}</span>
}

export const FlashString = ({ value }: { value: string | number }) => {
    const colorStyle = useColorChange(value, {
        duration: 2000,
        property: 'background-color',
    })

    return <span style={colorStyle}>{value}</span>
}
