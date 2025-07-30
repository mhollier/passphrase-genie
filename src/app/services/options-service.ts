import { Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { generatePassphrase } from '../utils';
import { IPassphraseResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  public readonly wordCount: WritableSignal<number> = signal<number>(5);
  public readonly addNumber: WritableSignal<boolean> = signal<boolean>(true);
  public readonly addSpecialChar: WritableSignal<boolean> = signal<boolean>(true);
  public readonly capitalizeFirst: WritableSignal<boolean> = signal<boolean>(true);
  public readonly useSeparator: WritableSignal<boolean> = signal<boolean>(true);

  public readonly passphraseResult: WritableSignal<IPassphraseResult> = linkedSignal(() => 
    generatePassphrase({
          numberWords: this.wordCount(),
          useSeparatorCharacter: this.useSeparator(),
          appendNumber: this.addNumber(),
          appendSpecialCharacter: this.addSpecialChar(),
          capitalizeFirstWord: this.capitalizeFirst(),
      }));

  public regenerate(): void {
    this.passphraseResult.set(generatePassphrase({
          numberWords: this.wordCount(),
          useSeparatorCharacter: this.useSeparator(),
          appendNumber: this.addNumber(),
          appendSpecialCharacter: this.addSpecialChar(),
          capitalizeFirstWord: this.capitalizeFirst(),
      }));
  }

  public changeWordCount(delta: number) {
    this.wordCount.update(x => Math.max(1, x + delta));
  }

  public copyToClipboard() {
    navigator.clipboard.writeText(this.passphraseResult().passphrase);
  }
}
