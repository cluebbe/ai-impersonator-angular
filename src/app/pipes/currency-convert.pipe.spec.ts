import { TestBed } from '@angular/core/testing';
import { CurrencyConvertPipe } from './currency-convert.pipe';

describe('CurrencyConvertPipe', () => {
  let pipe: CurrencyConvertPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyConvertPipe]
    });
    pipe = TestBed.inject(CurrencyConvertPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return same value for USD', () => {
    expect(pipe.transform(10, 'USD')).toBe(10);
  });

  it('should convert USD to EUR', () => {
    expect(pipe.transform(10, 'EUR')).toBeCloseTo(9.2, 1);
  });

  it('should convert USD to GBP', () => {
    expect(pipe.transform(10, 'GBP')).toBeCloseTo(7.9, 1);
  });

  it('should convert USD to JPY', () => {
    expect(pipe.transform(10, 'JPY')).toBeCloseTo(1495, 0);
  });

  it('should convert USD to CHF', () => {
    expect(pipe.transform(10, 'CHF')).toBeCloseTo(8.8, 1);
  });

  it('should handle case-insensitive currency codes', () => {
    expect(pipe.transform(10, 'eur')).toBeCloseTo(9.2, 1);
    expect(pipe.transform(10, 'EuR')).toBeCloseTo(9.2, 1);
  });

  it('should return 0 for null amount', () => {
    expect(pipe.transform(null as any, 'EUR')).toBe(0);
  });

  it('should return 0 for NaN amount', () => {
    expect(pipe.transform(NaN, 'EUR')).toBe(0);
  });

  it('should default to USD for unknown currency', () => {
    expect(pipe.transform(10, 'UNKNOWN')).toBe(10);
  });

  it('should convert 0 to 0', () => {
    expect(pipe.transform(0, 'EUR')).toBe(0);
  });

  it('should handle negative amounts', () => {
    expect(pipe.transform(-10, 'EUR')).toBeCloseTo(-9.2, 1);
  });

  it('should have supported currencies list', () => {
    const currencies = pipe.getSupportedCurrencies();
    expect(currencies).toContain('USD');
    expect(currencies).toContain('EUR');
    expect(currencies).toContain('GBP');
  });
});
