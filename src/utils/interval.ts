export interface Interval {
    from: number
    to: number
}

export function isNumberBetweenInverval(value: number, interval: Interval)
{
    return value >= interval.from && value <= interval.to;
}