export enum TimeUnit {
  Day = 'd',
  Week = 'w',
  Month = 'M',
  Quarter = 'Q',
  Year = 'y',
  Hour = 'h',
  Minute = 'm',
  Second = 's',
  Millisecond = 'ms',
}

export interface DateCalculator {
  add(date: Date, amount: number, unit: TimeUnit): Date
  subtract(date: Date, amount: number, unit: TimeUnit): Date
  difference(startDate: Date, endDate: Date, unit: TimeUnit): number
  isBefore(date1: Date, date2: Date): boolean
  isAfter(date1: Date, date2: Date): boolean
}
