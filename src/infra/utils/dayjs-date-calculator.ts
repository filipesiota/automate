import dayjs, { type ManipulateType } from 'dayjs'

import type { DateCalculator, TimeUnit } from '@/core/utils/date-calculator'

export class DayjsDateCalculator implements DateCalculator {
  add(date: Date, amount: number, unit: TimeUnit): Date {
    return dayjs(date)
      .add(amount, unit as ManipulateType)
      .toDate()
  }

  subtract(date: Date, amount: number, unit: TimeUnit): Date {
    return dayjs(date)
      .subtract(amount, unit as ManipulateType)
      .toDate()
  }

  difference(startDate: Date, endDate: Date, unit: TimeUnit): number {
    return dayjs(endDate).diff(dayjs(startDate), unit)
  }

  isBefore(date1: Date, date2: Date): boolean {
    return dayjs(date1).isBefore(dayjs(date2))
  }

  isAfter(date1: Date, date2: Date): boolean {
    return dayjs(date1).isAfter(dayjs(date2))
  }
}
