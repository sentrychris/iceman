import { JSDOM } from 'jsdom'
import { deepCopy } from '../../utilities'
import { settings } from '../config'

export class BaseParser
{
    public url: string = settings.app.sources.wiki

    async parseHtml(html: string | null)
    {
        if (!html) {
            return false
        }
        
        const dom = new JSDOM(html, {
            contentType: 'text/html'
        })
        
        const document = dom.window.document
        const table = document.querySelector('table.wikitable')
        if (!table) {
            return false 
        }
        
        const rows = [...table.querySelectorAll('tr')]
        if (!rows) {
            return false
        }
        
        const row = rows.shift()
        if (!row) {
            return false
        }
        
        const headers = row.querySelectorAll('th')
        console.log(headers)
        
        return rows.map(row => {
            const parse = (arr: Array<HTMLElement|NodeList>, round: number) => {
                return arr.reduce((acc, cell, i) => {
                    i = round === 2 ? i+2 : i

                    if (!headers[i]) {
                        return false
                    }

                    const content = headers[i].textContent
                    if (!content) {
                        return false
                    }

                    //@ts-ignore
                    acc[content.trim()] = cell.textContent.trim()
                    return acc
                }, {})
            }

            const dest = parse([...row.querySelectorAll('th')], 1)
            const source = parse([...row.querySelectorAll('td')], 2)

            return deepCopy(source, dest)
        })
    }
}