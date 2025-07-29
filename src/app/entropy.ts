import { specialCharacters } from './models';

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + specialCharacters;
const charsetLength = charset.length;

function getCharsetSize(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  for (let i = 0; i < specialCharacters.length; i++) {
      if (password.includes(specialCharacters.charAt(i))) {
          charsetSize += specialCharacters.length;
          break;
      }
  }

  return charsetSize;
}

export function calculateEntropy(password: string): number {
    console.log(password);
    // E = L × log2(R)
    //      R — Size of the pool of unique characters from which we build the password; and
    //      L — Password length, i.e., the number of characters in the password.
    const charsetSize = getCharsetSize(password);
    console.log('charsetSize='+charsetSize);
    return password.length === 0 ? 0 : Math.floor(password.length * Math.log2(charsetSize));
}

export function calculateScore(entropy: number): number {
    if (entropy < 64) return 0;
    if (entropy < 96) return 1;
    if (entropy < 128) return 2;
    return 3;
}

export function getScoreText(score: number): string {
    const scoreText =  [
        'Weak',
        'Fair',
        'Strong',
        'Very Strong'
    ]
    return score < scoreText.length ? scoreText[score] : ''
}
