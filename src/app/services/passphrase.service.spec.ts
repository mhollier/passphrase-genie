import { PassphraseService } from './passphrase.service';
import { IPassphraseOptions } from '../models';
import { DicewareDictionaryService } from './dicewareWordDictionary';

describe('PassphraseService', () => {
  let service: PassphraseService;
  let mockDictionaryService: jasmine.SpyObj<DicewareDictionaryService>;

  const testDictionary = {
    '11111': 'apple',
    '11112': 'banana',
    '11113': 'cat',
    '11114': 'dog',
    '11115': 'egg',
    '11116': 'fish',
  };

  beforeEach(() => {
    mockDictionaryService = jasmine.createSpyObj('DicewareDictionaryService', ['getDictionary']);
    mockDictionaryService.getDictionary.and.returnValue(testDictionary);
    service = new PassphraseService(mockDictionaryService);
  });

  describe('generatePassphrase', () => {
    // Helper to stub methods and Math.random
    function stubRandomWordsAndNumbers() {
      spyOn(service as any, 'generateIndex').and.returnValues('11111', '11112', '11113', '11114', '11115');
      spyOn(service as any, 'generateRandomInteger').and.returnValue(5);
      spyOn(service as any, 'generateRandomSpecialCharacter').and.returnValue('@');
    }

    it('should generate a passphrase with 3 words, no sep, no cap, no num, no special char', () => {
      // Arrange
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 3,
        useSeparatorCharacter: false,
        capitalizeFirstWord: false,
        appendNumber: false,
        appendSpecialCharacter: false
      };

      // Act
      const result = service.generatePassphrase(options);

      // Assert
      expect(result.passphrase).toBe('applebanana' + 'cat'); // joined with no separator
      expect(result.entropy).toBeGreaterThan(0);
      expect(['Weak', 'Fair', 'Strong', 'Very Strong']).toContain(result.scoreText);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should capitalize first word if option is true', () => {
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 2,
        useSeparatorCharacter: false,
        capitalizeFirstWord: true,
        appendNumber: false,
        appendSpecialCharacter: false
      };
      const result = service.generatePassphrase(options);
      expect(result.passphrase.startsWith('A')).toBeTrue();
    });

    it('should append number if option is true', () => {
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 2,
        useSeparatorCharacter: false,
        capitalizeFirstWord: false,
        appendNumber: true,
        appendSpecialCharacter: false
      };
      const result = service.generatePassphrase(options);
      expect(result.passphrase.endsWith('5')).toBeTrue();
    });

    it('should append special character if option is true', () => {
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 2,
        useSeparatorCharacter: false,
        capitalizeFirstWord: false,
        appendNumber: false,
        appendSpecialCharacter: true
      };
      const result = service.generatePassphrase(options);
      expect(result.passphrase.endsWith('@')).toBeTrue();
    });

    it('should join words with separator if option is true', () => {
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 3,
        useSeparatorCharacter: true,
        capitalizeFirstWord: false,
        appendNumber: false,
        appendSpecialCharacter: false
      };
      const result = service.generatePassphrase(options);
      expect(result.passphrase).toBe('apple-banana-cat');
    });

    it('should handle all options enabled', () => {
      stubRandomWordsAndNumbers();
      const options: IPassphraseOptions = {
        numberWords: 2,
        useSeparatorCharacter: true,
        capitalizeFirstWord: true,
        appendNumber: true,
        appendSpecialCharacter: true
      };
      const result = service.generatePassphrase(options);
      expect(result.passphrase).toBe('Apple-banana5@');
      expect(result.entropy).toBeGreaterThan(0);
      expect(['Weak', 'Fair', 'Strong', 'Very Strong']).toContain(result.scoreText);
    });
  });

  describe('private helpers', () => {
    it('should generate index in correct format', () => {
      const index = (service as any).generateIndex();
      expect(index).toMatch(/^[1-6]{5}$/);
      expect(index.length).toBe(5);
    });

    it('should generate random integer between 1 and max', () => {
      const n = (service as any).generateRandomInteger(9);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(9);
    });

    it('should generate a valid special character', () => {
      const char = (service as any).generateRandomSpecialCharacter();
      expect(PassphraseService['specialCharacters']).toContain(char);
    });

    it('should calculate score correctly', () => {
      expect((service as any).calculateScore(10)).toBe(0);
      expect((service as any).calculateScore(70)).toBe(1);
      expect((service as any).calculateScore(110)).toBe(2);
      expect((service as any).calculateScore(130)).toBe(3);
    });

    it('should get correct score text', () => {
      expect((service as any).getScoreText(0)).toBe('Weak');
      expect((service as any).getScoreText(1)).toBe('Fair');
      expect((service as any).getScoreText(2)).toBe('Strong');
      expect((service as any).getScoreText(3)).toBe('Very Strong');
      expect((service as any).getScoreText(4)).toBe('');
    });
  });
});
