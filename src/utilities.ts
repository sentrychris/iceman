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

export function deepCopy(source: any, dest: any = null) {
    let name,
        value,
        isArray,
        toString = Object.prototype.toString

    if (!dest) {
        isArray = toString.call(source) === "[object Array]"
        if (isArray) {
            dest = []
            dest.length = source.length
        } else {
            dest = {}
        }
    }

    for (name in source) {
        if (!isArray || source.hasOwnProperty(name)) {
            value = source[name]

            if (typeof value === "object") {
                value = deepCopy(value)
            }

            dest[name] = value
        }
    }

    return dest
}