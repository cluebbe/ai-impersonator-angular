import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a price from USD to the specified currency using exchange rates.
 * 
 * Usage: {{ price | currencyConvert:'EUR' }}
 */
@Pipe({
  name: 'currencyConvert',
  standalone: true
})
export class CurrencyConvertPipe implements PipeTransform {
  // Exchange rates relative to USD (1 USD = X of target currency)
  private readonly exchangeRates: { [key: string]: number } = {
    'USD': 1.00,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 149.50,
    'CHF': 0.88,
    'CAD': 1.36,
    'AUD': 1.54,
    'NZD': 1.67,
    'CNY': 7.24,
    'INR': 83.12,
    'MXN': 17.05,
    'BRL': 4.97,
  };

  /**
   * Converts the given amount from USD to the target currency
   * @param amount - The amount in USD
   * @param targetCurrency - The target currency code (e.g., 'EUR', 'GBP')
   * @returns The converted amount
   */
  transform(amount: number, targetCurrency: string = 'USD'): number {
    if (amount == null || isNaN(amount)) {
      return 0;
    }

    const rate = this.exchangeRates[targetCurrency.toUpperCase()];
    if (!rate) {
      console.warn(`Unknown currency: ${targetCurrency}. Defaulting to USD.`);
      return amount;
    }

    return amount * rate;
  }

  /**
   * Get the supported currencies
   */
  getSupportedCurrencies(): string[] {
    return Object.keys(this.exchangeRates);
  }
}
