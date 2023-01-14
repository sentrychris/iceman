import { ammoParser } from './AmmoParser'
import { rifleAmmo } from './map/wikiAmmo'
import * as fs from 'fs'

/**
 * Fetch all rifle ammo types from the wiki and write to JSON
 */
for (const ammoType of rifleAmmo) {
    ammoParser.getData(ammoType).then(async (ammo) => {
        const data = await ammo.parseData()
        if (data) {
            const filename = `../storage/ammo/${ammoType}.json`
            fs.writeFileSync(filename, JSON.stringify(data, null, 4), {
                encoding: 'utf-8'
            })
        }
    })
}
