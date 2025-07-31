
export interface IPassphraseOptions {
  numberWords: number;
  useSeparatorCharacter: boolean;
  capitalizeFirstWord: boolean;
  appendNumber: boolean;
  appendSpecialCharacter: boolean;
}

export interface IPassphraseResult {
  passphrase: string;
  entropy: number;
  score: number;
  scoreText: string;
}
