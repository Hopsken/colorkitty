import { saveAs } from 'file-saver'
import { RGBColor } from 'react-color'
import { toHex, toRGBString } from './color'
import { exportPNG } from './export-palette-to-png'

function saveTextToFile(content: string, filename: string) {
    const blob = new Blob([ content ], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, filename)
}

function exportURL(colors: RGBColor[]) {
    return `https://colorkitty.com/${ colors.map(one => toHex(one).toLowerCase().slice(1)).join('-') }`
}

function exportSCSS(colors: RGBColor[], name: string) {
    const colorUrl = exportURL(colors)
    const text = `
/* ${ colorUrl } */

/* RGB */
${ colors.map((color, index) => `$color${ index + 1 }: ` + toRGBString(color) + ';').join('\n') }
`.trimLeft()

    saveTextToFile(text, name + '.scss')
    return text
}

function exportJSON(colors: RGBColor[], name: string) {
    const text = JSON.stringify([{
        paletteName: name,
        colors: colors.map(one => toHex(one))
    }])

    saveTextToFile(text, name + '.json')
    return text
}

function exportHex(colors: RGBColor[], name: string) {
    const text =
`${ name }

${ colors.map(one => toHex(one)).join('\n') }
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
