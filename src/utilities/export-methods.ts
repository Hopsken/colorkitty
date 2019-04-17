import { saveAs } from 'file-saver'
import { RGBColor } from 'react-color'

import { colorCombinations } from './color'
import { toHex, toRGBString } from './color'
import { exportPNG } from './export-palette-to-png'

function getColorListShades(colors: RGBColor[]) {
    const degrees = [10, 30, 40, 50, 60, 80, 90]
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']

    const res = {}
    colors.forEach((color, index1) => {
        const shades = colorCombinations['shades'](color)
        shades.forEach((shade, index2) => {
            res[alphabet[index1] + degrees[index2]] = shade.toUpperCase()
        })
    })

    return res
}

function saveTextToFile(content: string, filename: string) {
    const blob = new Blob([ content ], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, filename)
}

function exportURL(colors: RGBColor[], name: string) {
    return `https://colorkitty.com/${ colors.map(one => toHex(one).toLowerCase().slice(1)).join('-') }` +
        (name !== 'New Palette' ? `?name=${ name }` : '')
}

function exportSCSS(colors: RGBColor[], name: string, includeShades = false) {
    const colorUrl = exportURL(colors, name)

    let colorText = ''
    if (includeShades) {
        const allShades = getColorListShades(colors)
        colorText = Object.keys(allShades).map(key => `$${ key }: ${ allShades[key] };`).join('\n')
    } else {
        colorText = colors.map((color, index) => `$color${ index + 1 }: ` + toRGBString(color) + ';').join('\n')
    }

    const text = `
/* ${ colorUrl } */

/* Colors */
${ colorText }
`.trimLeft()

    saveTextToFile(text, name + '.scss')
    return text
}

function exportJSON(colors: RGBColor[], name: string, includeShades = true) {
    const text = JSON.stringify({
        paletteName: name,
        colors: includeShades ? getColorListShades(colors) : colors.map(one => toHex(one))
    }, null, 4)

    saveTextToFile(text, name + '.json')
    return text
}

function exportHex(colors: RGBColor[], name: string, includeShades = false) {
    let colorText = ''
    if (includeShades) {
        const allShades = getColorListShades(colors)
        colorText = Object.keys(allShades).map(key => allShades[key]).join('\n')
    } else {
        colorText = colors.map(one => toHex(one)).join('\n')
    }

    const text =
`${ name }

${ colorText }
`
    return text
}

export enum ExportMethod {
    URL = 'url',
    PNG = 'png',
    SCSS = 'scss',
    JSON = 'json',
    HEX = 'hex'
}

export const exportMethods = {
    url: exportURL,
    png: exportPNG,
    scss: exportSCSS,
    json: exportJSON,
    hex: exportHex
}
