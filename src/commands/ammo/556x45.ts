import { EmbedFieldData, Message, MessageEmbed } from 'discord.js'

const ammo: string = '556x45'

export const ammo556x45: EmbedFieldData[] = [
    { name: "SSA AP", value: "38 Damage\n57 Penetration Power\n64 Armor Damage\n20% Fragmentation Chance\n48% Ricochet Chance", inline: true },
    { name: "MK 318 Mod 0 (SOST)", value: "69 Damage\n20 Penetration Power\n35 Armor Damage\n15% Fragmentation Chance\n10% Ricochet Chance", inline: true },
    { name: "MK 255 Mod 0 (RRLP)", value: "63 Damage\n18 Penetration Power\n32 Armor Damage\n3% Fragmentation Chance\n10% Ricochet Chance", inline: true },
    { name: "M995", value: "42 Damage\n53 Penetration Power\n58 Armor Damage\n32% Fragmentation Chance\n36% Ricochet Chance", inline: true },
    { name: "M856", value: "59 Damage\n23 Penetration Power\n54 Armor Damage\n32.8% Fragmentation Chance\n38% Ricochet Chance", inline: true },
    { name: "M856A1", value: "54 Damage\n37 Penetration Power\n52 Armor Damage\n32.8% Fragmentation Chance\n38% Ricochet Chance", inline: true },
    { name: "M855", value: "53 Damage\n28 Penetration Power\n37 Armor Damage\n40% Fragmentation Chance\n40% Ricochet Chance", inline: true },
    { name: "M855A1", value: "49 Damage\n44 Penetration Power\n52 Armor Damage\n34% Fragmentation Chance\n38% Ricochet Chance", inline: true },
    { name: "WArmor Damageageddon", value: "88 Damage\n3 Penetration Power\n11 Armor Damage\n90% Fragmentation Chance\n5% Ricochet Chance", inline: true },
    { name: "HP", value: "79 Damage\n8 Penetration Power\n22 Armor Damage\n70% Fragmentation Chance\n20% Ricochet Chance", inline: true },
    { name: "FMJ", value: "54 Damage\n23 Penetration Power\n33 Armor Damage\n50% Fragmentation Chance\n26% Ricochet Chance", inline: true },
]

export function command556x45(prefix: string, message: Message): void {
    if (message.content === `${prefix}${ammo}`) {
        const ammoTypes = []
        for (const type of ammo556x45) {
            ammoTypes.push(type.name)
        }
    
        const embed = new MessageEmbed()
            .setColor(0x3498DB)
            .setTitle("5.56x45mm NATO")
            .setDescription("Ballistics Information")
            .setThumbnail("https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/5f/GunsmithPart1Icon.png/revision/latest/zoom-crop/width/500/height/500?cb=20180425214223")
            .addField('Variants', ammoTypes.join('\n'))
        
        message.channel.send({ embeds: [embed] })
    } else if (message.content.startsWith(`${prefix}${ammo}`)) {
        const split = message.content.split(ammo)
        const ammoSubType = split[1]
        const matchedAmmo = ammo556x45.find((ammo: EmbedFieldData) => ammo.name === ammoSubType.trim())
    
        if (matchedAmmo) {
            const embed = new MessageEmbed()
                .setColor(0x3498DB)
                .setTitle(`5.56x45mm NATO ${matchedAmmo.name}`)
                .setDescription("Ballistics Information")
                .setThumbnail("https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/5f/GunsmithPart1Icon.png/revision/latest/zoom-crop/width/500/height/500?cb=20180425214223")
                .addFields(matchedAmmo)
        
            message.channel.send({ embeds: [embed] })
        }
    }
}