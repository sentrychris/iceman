import { ammoParser } from '../ammo/AmmoParser'
import { rifleAmmo } from '../wiki/slugs'
import * as fs from 'fs';

for (const ammoType of rifleAmmo) {
    ammoParser.getData(ammoType).then(async (ammo) => {
        const data = await ammo.parseData()
        if (data) {
            const filename = `../../../storage/ammo/${ammoType}.json`
            fs.writeFileSync(filename, JSON.stringify(data, null, 4), {
                encoding: 'utf-8'
            })
        }
    })
}
