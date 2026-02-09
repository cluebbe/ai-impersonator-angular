import { Pipe, PipeTransform } from '@angular/core';

/**
 * Calculates the daily usage price based on server load percentage.
 * 
 * Formula: (serverLoad / 100) * basePrice
 * Default base price: $10 per day at 100% load
 * 
 * Usage: {{ serverLoad | usagePrice | currency }} or {{ serverLoad | usagePrice: 15 | currency }}
 */
@Pipe({
  name: 'usagePrice',
  standalone: true
})
export class UsagePricePipe implements PipeTransform {
  /**
   * Transforms server load percentage to daily usage price
   * @param loadPercentage - Server load as a percentage (0-100)
   * @param basePricePerDay - Optional base price at 100% load (default: $10)
   * @returns Numeric price value for use with currency pipe
   */
  transform(loadPercentage: number, basePricePerDay: number = 10): number {
    if (loadPercentage == null || loadPercentage < 0 || loadPercentage > 100) {
      return 0;
    }

    const dailyPrice = (loadPercentage / 100) * basePricePerDay;
    return dailyPrice;
  }
}
