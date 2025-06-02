import { EmbedBuilder } from 'discord.js';
import { DISCORD_COLOR } from '../config';

const MEME_ICON = 'https://i.imgur.com/ZQZSWrt.png'; // Fallback meme icon
const MEME_SOURCE = 'https://www.reddit.com/r/memeframe/top.json?t=week&limit=50';

/**
 * Builds an embed showing a random Warframe meme from r/memeframe.
 */
export const buildMemeframeEmbed = async (): Promise<EmbedBuilder> => {
  try {
    const res = await fetch(MEME_SOURCE);
    const json = await res.json();

    const posts = json.data.children
      .map((post: any) => post.data)
      .filter((p: any) => !p.over_18 && p.post_hint === 'image');

    if (posts.length === 0) {
      throw new Error('No suitable memes found');
    }

    const meme = posts[Math.floor(Math.random() * posts.length)];

    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.purple)
      .setTitle(meme.title)
      .setURL(`https://reddit.com${meme.permalink}`)
      .setImage(meme.url)
      .setFooter({ text: 'Source: r/memeframe via Reddit' });
  } catch (err) {
    console.error('Failed to fetch meme:', err);
    return new EmbedBuilder()
      .setColor(DISCORD_COLOR.red)
      .setTitle('Warframe Meme')
      .setDescription('Unable to fetch meme at this time. Try again later.')
      .setThumbnail(MEME_ICON);
  }
};
