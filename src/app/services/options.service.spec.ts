import { TestBed } from '@angular/core/testing';
import { OptionsService } from './options.service';

describe('OptionsService', () => {
  let service: OptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values', () => {
    expect(service.wordCount()).toBe(5);
    expect(service.addNumber()).toBeTrue();
    expect(service.addSpecialChar()).toBeTrue();
    expect(service.capitalizeFirst()).toBeTrue();
    expect(service.useSeparator()).toBeTrue();
  });

  describe('decrementWordCount', () => {
    it('should decrement wordCount by 1', () => {
      service.wordCount.set(5);
      service.decrementWordCount();
      expect(service.wordCount()).toBe(4);
    });

    it('should not decrement below 1', () => {
      service.wordCount.set(1);
      service.decrementWordCount();
      expect(service.wordCount()).toBe(1);
    });
  });

  describe('incrementWordCount', () => {
    it('should increment wordCount by 1', () => {
      service.wordCount.set(5);
      service.incrementWordCount();
      expect(service.wordCount()).toBe(6);
    });

    it('should never set wordCount below 1 even after increment', () => {
      service.wordCount.set(0); // forcibly set invalid value
      service.incrementWordCount();
      expect(service.wordCount()).toBe(1);
    });
  });
});
