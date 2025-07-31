import { Injectable } from '@angular/core';
import { IPassphraseOptions, IPassphraseResult } from '../models';
import { DicewareDictionaryService } from './dicewareWordDictionary';

@Injectable({
  providedIn: 'root'
})
export class PassphraseService {
  private static readonly specialCharacters = "!@#$%^&*()_+~`|}{[]\:;?><,./-=";
  private readonly dicewareWordDictionary: Record<string, string>;

  public constructor(private dictionaryService: DicewareDictionaryService) {
    this.dicewareWordDictionary = dictionaryService.getDictionary();
  }

  public generatePassphrase(options: IPassphraseOptions): IPassphraseResult {
    const separatorCharacter = '-';
    let passphrase = '';
    for (let i = 0; i < options.numberWords; i++) {
      const word: string = this.generatePassphraseWord();
      passphrase +=
        i > 0 && options.useSeparatorCharacter
          ? separatorCharacter + word
          : word;
    }

    if (options.capitalizeFirstWord === true) {
      passphrase = passphrase[0].toLocaleUpperCase() + passphrase.slice(1);
    }

    if (options.appendNumber === true) {
      passphrase += this.generateRandomInteger(9);
    }

    if (options.appendSpecialCharacter === true) {
      passphrase += this.generateRandomSpecialCharacter();
    }

    const entropy: number = this.calculateEntropy(passphrase);
    const score: number = this.calculateScore(entropy);
    const scoreText: string = this.getScoreText(score);
    return {
      passphrase,
      entropy,
      score,
      scoreText
    };
  }

  private generateIndex(): string {
    const numDice = 5;
    let index = '';
    for (let i = 0; i < numDice; i++) {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      index += diceRoll.toString();
    }
    return index;
  }

  private generatePassphraseWord(): string {
    let index = this.generateIndex();
    while (!this.dicewareWordDictionary[index]) {
      index = this.generateIndex();
    }
    return this.dicewareWordDictionary[index];
  }

  private generateRandomInteger(maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber) + 1;
  }

  private generateRandomSpecialCharacter(): string {
    const index = Math.floor(Math.random() * PassphraseService.specialCharacters.length);
    return PassphraseService.specialCharacters[index];
  }

  private getCharsetSize(password: string): number {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    for (let i = 0; i < PassphraseService.specialCharacters.length; i++) {
      if (password.includes(PassphraseService.specialCharacters.charAt(i))) {
        charsetSize += PassphraseService.specialCharacters.length;
        break;
      }
    }

    return charsetSize;
  }

  private calculateEntropy(password: string): number {
    // E = L × log2(R)
    //      R — Size of the pool of unique characters from which we build the password; and
    //      L — Password length, i.e., the number of characters in the password.
    const charsetSize = this.getCharsetSize(password);
    return password.length === 0 ? 0 : Math.floor(password.length * Math.log2(charsetSize));
  }

  private calculateScore(entropy: number): number {
    if (entropy < 64) return 0;
    if (entropy < 96) return 1;
    if (entropy < 128) return 2;
    return 3;
  }

  private getScoreText(score: number): string {
    const scoreText = [
      'Weak',
      'Fair',
      'Strong',
      'Very Strong'
    ]
    return score < scoreText.length ? scoreText[score] : ''
  }
}
