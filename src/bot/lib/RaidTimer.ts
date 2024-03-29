import {formatTime, hours} from '../../utilities';
import { EmbedBuilder } from 'discord.js';

export class RaidTimer
{
  private multiplier = 7;

  realTimeToTarkovTime(time: Date, left: boolean): Date {
    const offset = hours(3) + (left ? 0 : hours(12)); // 3 = St Petersburg offset
    const tarkovTime = new Date((offset + (time.getTime() * this.multiplier)) % hours(24));
    
    return tarkovTime;
  }

  getTarkovTime(local: boolean) {
    return formatTime(this.realTimeToTarkovTime(new Date(), local));
  }
}

export function getRaidTimes({embed}: {embed: boolean}): EmbedBuilder | Record<string, string>
{
  const timer = new RaidTimer;
  const left = timer.getTarkovTime(true);
  const right = timer.getTarkovTime(false);

  if (embed) {
    return new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle('Tarkov Time')
      .setDescription('Local Raid Times')
      .addFields(
        { name: 'Left', value: left, inline: true},
        { name: 'Right', value: right, inline: true}
      );
  }

  return {
    left, right
  };
}