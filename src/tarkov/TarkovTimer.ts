import {formatTime, hours} from '../utilities'

export class TarkovTimer
{
    private multiplier: number = 7

    realTimeToTarkovTime(time: Date, left: boolean): Date {
        const offset = hours(3) + (left ? 0 : hours(12)) // 3 = St Petersburg offset
        const tarkovTime = new Date((offset + (time.getTime() * this.multiplier)) % hours(24))
    
        return tarkovTime
    }

    getTarkovTime(local: boolean) {
        return formatTime(this.realTimeToTarkovTime(new Date(), local))
    }
}