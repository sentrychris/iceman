export function formatTime(date: Date): string {
    return [
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    ].map((x) => {
        return x.toString().padStart(2, '0')
    }).join(':')
}

export function hours(n: number): number {
    return 1000 * 60 * 60 * n
}