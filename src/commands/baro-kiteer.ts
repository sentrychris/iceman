import { WARFRAME_API } from '../config';

/**
 * Locate Baro Ki'Teer the void trader.
 *
 * @returns 
 */
export const baroKiteerLocation = async (): Promise<string> => {
  try {
    const res = await fetch(`${WARFRAME_API}/voidTrader`);
    const data = await res.json();

    if (data.active) {
      return `**Baro Ki'Teer** is currently at the **${data.location}** and will leave in **${data.endString}**.`;
    } else {
      return `**Baro Ki'Teer** will arrive at the **${data.location}** in **${data.startString}**.`;
    }
  } catch (err) {
    console.error(err);
    return 'Unable to fetch Baro Ki\'Teer info right now.';
  }
}