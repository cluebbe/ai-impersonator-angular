import { TestBed } from '@angular/core/testing';
import { UsagePricePipe } from './usage-price.pipe';

describe('UsagePricePipe', () => {
  let pipe: UsagePricePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsagePricePipe]
    });
    pipe = TestBed.inject(UsagePricePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 for 0% load', () => {
    expect(pipe.transform(0)).toBe(0);
  });

  it('should return 5 for 50% load with default base price', () => {
    expect(pipe.transform(50)).toBe(5);
  });

  it('should return 10 for 100% load with default base price', () => {
    expect(pipe.transform(100)).toBe(10);
  });

  it('should handle custom base price', () => {
    expect(pipe.transform(50, 20)).toBe(10);
  });

  it('should handle custom base price at 100% load', () => {
    expect(pipe.transform(100, 25)).toBe(25);
  });

  it('should return 0 for null input', () => {
    expect(pipe.transform(null as any)).toBe(0);
  });

  it('should return 0 for negative load', () => {
    expect(pipe.transform(-10)).toBe(0);
  });

  it('should return 0 for load > 100', () => {
    expect(pipe.transform(150)).toBe(0);
  });

  it('should handle decimal values correctly', () => {
    expect(pipe.transform(33.33)).toBeCloseTo(3.333, 2);
    expect(pipe.transform(66.67)).toBeCloseTo(6.667, 2);
  });
});
