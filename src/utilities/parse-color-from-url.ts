import tinyColor from 'tinycolor2'
import { RGBColor } from 'react-color'

export function parseColorsFromUrl() {
    let isValid = true
    const { pathname } = location

    const hexColors = pathname.slice(1).split('-')
    const rgbColors = hexColors.map(one => {
        const color = new tinyColor(one)
        if (!color.isValid()) {
            isValid = false
        }
        return color.toRgb() as RGBColor
    })

    return isValid ? rgbColors : null
}
