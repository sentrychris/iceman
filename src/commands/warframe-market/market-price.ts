import { EmbedBuilder } from 'discord.js';
import { WARFRAME_MARKET_API } from '../../config';

type SellOrder = {
  platinum: number;
  seller: string;
  quantity: number;
  region: string;
};

/**
 * Fetches the single cheapest current sell order for a given Warframe Market item slug
 * @param slug - Warframe Market item slug (e.g., "octavia_prime_neuroptics")
 * @returns The cheapest sell order or null
 */
export const getWarframeMarketCheapestSellOrder = async (slug: string): Promise<SellOrder | null> => {
  try {
    const response = await fetch(`${WARFRAME_MARKET_API}/orders/item/${slug}/top`, {
      headers: {
        'Accept': 'application/json',
        'Platform': 'pc',
        'Language': 'en',
      },
    });

    if (!response.ok) {
      console.error(`WFM API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    const sellOrders = json.data.sell
      .filter((order: any) => order.user.status === 'ingame')
      .sort((a: any, b: any) => a.platinum - b.platinum);

    if (sellOrders.length === 0) return null;

    const best = sellOrders[0];
    return {
      platinum: best.platinum,
      seller: best.user.ingameName,
      quantity: best.quantity,
      region: best.user.platform,
    };
  } catch (err) {
    console.error('Failed to fetch cheapest sell order:', err);
    return null;
  }
};

/**
 * Builds an embed showing the cheapest current sell order,
 * and provides a preformatted whisper message
 * @param itemName - Display name of the item
 * @param order - The cheapest sell order
 */
export const buildMarketPriceEmbed = (itemName: string, order: SellOrder): EmbedBuilder => {
  const whisper = `/w ${order.seller} Hi! I want to buy: "${itemName}" for ${order.platinum} platinum. (warframe.market)`;

  return new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle(`Cheapest Sell Order: ${itemName}`)
    .addFields(
      { name: 'Platinum', value: `${order.platinum}p`, inline: true },
      { name: 'Seller', value: order.seller, inline: true },
      { name: 'Quantity', value: `${order.quantity}`, inline: true },
      { name: 'Copy & Paste Whisper', value: `\`${whisper}\``, inline: false },
    )
    .setThumbnail('https://warframe.market/static/build/resources/images/logo-black.3bec6a3a0f1e6f1edbb1.png')
    .setFooter({ text: `Region: ${order.region} • Only sellers currently in-game` });
};
