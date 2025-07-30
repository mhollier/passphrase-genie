import { IPassphraseOptions, IPassphraseResult } from '../models';
import { dicewareWordDictionary } from './dicewareWordDictionary';
import { calculateEntropy, calculateScore, getScoreText } from './entropy';

function generateIndex(): string {
    const numDice = 5;
    let index = '';
    for (let i = 0; i < numDice; i++) {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        index += diceRoll.toString();
    }
    return index;
}

function generatePassphraseWord(): string {
    let index = generateIndex();
    while (!dicewareWordDictionary[index]) {
        index = generateIndex();
    }
    return dicewareWordDictionary[index];
}

function generateRandomInteger(maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber) + 1;
}

function generateRandomSpecialCharacter(): string {
    const specialCharacters = "!@#$%^&*()_+~`|}{[]\:;?><,./-=";
    const index = Math.floor(Math.random() * specialCharacters.length);
    return specialCharacters[index];
}

export function generatePassphrase(options: IPassphraseOptions): IPassphraseResult {  
    const separatorCharacter = '-';
    let passphrase = '';
    for (let i = 0; i < options.numberWords; i++) {
        const word: string = generatePassphraseWord();
        passphrase +=
            i > 0 && options.useSeparatorCharacter
                ? separatorCharacter + word
                : word;
    }

    if (options.capitalizeFirstWord === true) {
        passphrase = passphrase[0].toLocaleUpperCase() + passphrase.slice(1);
    }

    if (options.appendNumber === true) {
        passphrase += generateRandomInteger(9);
    }

    if (options.appendSpecialCharacter === true) {
        passphrase += generateRandomSpecialCharacter();
    }

    const entropy: number = calculateEntropy(passphrase);
    const score: number = calculateScore(entropy);
    const scoreText: string = getScoreText(score);
    return {
        passphrase,
        entropy,
        score,
        scoreText
    }; 
}
