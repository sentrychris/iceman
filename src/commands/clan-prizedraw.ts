import { EmbedBuilder } from 'discord.js';

// Logged in past 4 days
const eligibleMembers = [
  'Joolri',
  'ELLADARAS1 ',
  'KingInTheRings',
  'muxi69',
  'Corona9 ',
  'KingOneTap2675',
  'JonathanDuhGoat',
  'Miky_69',
  'XXScaryQrowXX ',
  'Galaxycc_',
  'BLACK-OP',
  'King_Tinz ',
  'SyctheDefalt  ',
  'Reinion ',
  'IamAstraeus ',
  'ScooterHitMe',
  'PROPODIDA ',
  'davedaniel69 ',
  'larry123987',
  'BDP88',
  'GuraChampion ',
  'rackety_cavalry4',
  'MidgetBoy06',
  'var_zal',
  'Elyyfio',
  'Alonsoy',
  'Sp14d3r_m4n',
];

const eligiblePrizes = [
  '1x Omni Forma',
  '3x Riven Mod Slots',
  '1x Veiled Riven Cipher',
  '3x Forma Bundle',
  '1x Catalyst Reactor',
  '1x Orokin Reactor',
  '1x Exilus Warframe Adapter',
  '1x Exilus Weapon Adapter',
  '1x Primary Arcane Adapter',
  '1x Secondary Arcane Adapter',
  '2x Weapon slots',
  '1x Warframe slot',
  '1,000 Endo',
]

const clanPrizeDraw = (): { user: string, prize: string } => {
  return {
    user: eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)].trim(),
    prize: eligiblePrizes[Math.floor(Math.random() * eligiblePrizes.length)]
  };
};


export const buildClanPrizeDrawEmbed = (): EmbedBuilder => {
  const { user, prize } = clanPrizeDraw();

  return new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('Clan Monthly Giveaway Prize Draw')
    .setDescription('Congratulations to our randomly selected winner! Your prize will be gifted to you through the in-game market.')
    .addFields(
      { name: 'Member', value: user, inline: true },
      { name: 'Prize', value: prize, inline: true }
    )
    .setThumbnail('https://i.imgur.com/fQn9zNL.png');
};
