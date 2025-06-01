import { type Client, EmbedBuilder, TextChannel } from "discord.js";
import { CLAN_ANNOUNCEMENTS_CHANNEL } from "../config";

// Logged in past 4 days
const eligibleMembers = [
  "Joolri",
  "ELLADARAS1 ",
  "KingInTheRings",
  "muxi69",
  "Corona9 ",
  "KingOneTap2675",
  "JonathanDuhGoat",
  "Miky_69",
  "XXScaryQrowXX ",
  "Galaxycc_",
  "BLACK-OP",
  "King_Tinz ",
  "SyctheDefalt  ",
  "Reinion ",
  "IamAstraeus ",
  "ScooterHitMe",
  "PROPODIDA ",
  "davedaniel69 ",
  "larry123987",
  "BDP88",
  "GuraChampion ",
  "rackety_cavalry4",
  "MidgetBoy06",
  "var_zal",
  "Elyyfio",
  "Alonsoy",
  "Sp14d3r_m4n",
];

const eligiblePrizes = [
  "1x Omni Forma",
  "3x Riven Mod Slots",
  "1x Veiled Riven Cipher",
  "3x Forma Bundle",
  "1x Catalyst Reactor",
  "1x Orokin Reactor",
  "1x Exilus Warframe Adapter",
  "1x Exilus Weapon Adapter",
  "1x Primary Arcane Adapter",
  "1x Secondary Arcane Adapter",
  "2x Weapon slots",
  "1x Warframe slot",
  "1,000 Endo",
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
    .setTitle("Clan Monthly Giveaway Prize Draw")
    .setDescription("Congratulations to our randomly selected winner! Your prize will be gifted to you through the in-game market.")
    .addFields(
      { name: 'Member', value: user, inline: true },
      { name: 'Prize', value: prize, inline: true }
    )
    .setThumbnail("https://i.imgur.com/fQn9zNL.png");
};

export const startClanPrizeDrawLoop = (client: Client): void => {
  client.once('ready', async () => {
    console.log('Prize draw loop scheduled');

    const channel = await client.channels.fetch(CLAN_ANNOUNCEMENTS_CHANNEL);

    if (!channel || !channel.isTextBased()) {
      console.error('Invalid or non-text channel for prize draw');
      return;
    }

    const sendPrizeDraw = async () => {
      try {
        await (channel as TextChannel).send({
          embeds: [buildClanPrizeDrawEmbed()],
        });
        console.log('Prize draw sent');
      } catch (err) {
        console.error('Failed to send prize draw embed:', err);
      }
    };

    // Calculate delay until next 12:00 PM
    const now = new Date();
    const nextNoon = new Date(now);
    nextNoon.setHours(12, 0, 0, 0);
    if (now >= nextNoon) {
      nextNoon.setDate(nextNoon.getDate() + 1); // schedule for tomorrow
    }
    const delay = nextNoon.getTime() - now.getTime();

    // Schedule initial prize draw at next 12 PM
    setTimeout(() => {
      sendPrizeDraw();

      // Then run every 24 hours (86,400,000 ms)
      setInterval(sendPrizeDraw, 24 * 60 * 60 * 1000);
    }, delay);
  });
};

