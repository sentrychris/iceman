import { JSDOM } from 'jsdom'
import { deepCopy } from '../../../utilities'
import { Ballistics } from '../../interfaces/Ballistics'

export class AmmoParser
{
    /**
    * Source data
    */
    protected data: string | null = null
    
    /**
    * Parsed json
    */
    public json: Array<Ballistics> = []
    
    /**
    * Fetch data
    * @param slug
    */
    async getData(slug: string): Promise<AmmoParser> {
        const response = await fetch(`https://escapefromtarkov.fandom.com/wiki/${slug}`)
        this.data = await response.text()
        
        return this
    }
    
    /**
    * Parse data
    * @returns 
    */
    async parseData(): Promise<Array<Ballistics> | false> {
        if (!this.data) {
            return false
        }
        
        const dom = new JSDOM(this.data, {
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
        this.json = rows.map(row => {
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

        return this.json
    }
}

export const ammoParser = new AmmoParser