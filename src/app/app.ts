import { CommonModule } from '@angular/common';
import { Component, linkedSignal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OptionsService, PassphraseService } from './services';
import { IPassphraseResult } from './models';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ClipboardModule, FormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatSlideToggleModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public readonly title = 'Passphrase Genie';

  public constructor(
    private clipboard: Clipboard,
    private optionsService: OptionsService,
    private passphraseService: PassphraseService
  ) { }

  public get wordCount(): WritableSignal<number> {
    return this.optionsService.wordCount;
  }

  public get addNumber(): WritableSignal<boolean> {
    return this.optionsService.addNumber;
  }

  public get addSpecialChar(): WritableSignal<boolean> {
    return this.optionsService.addSpecialChar;
  }

  public get capitalizeFirst(): WritableSignal<boolean> {
    return this.optionsService.capitalizeFirst;
  }

  public get useSeparator(): WritableSignal<boolean> {
    return this.optionsService.useSeparator;
  }

  public readonly passphraseResult: WritableSignal<IPassphraseResult> = linkedSignal(() =>
    this.passphraseService.generatePassphrase({
      numberWords: this.wordCount(),
      useSeparatorCharacter: this.useSeparator(),
      appendNumber: this.addNumber(),
      appendSpecialCharacter: this.addSpecialChar(),
      capitalizeFirstWord: this.capitalizeFirst(),
    }));

  public regenerate(): void {
    this.passphraseResult.set(this.passphraseService.generatePassphrase({
      numberWords: this.wordCount(),
      useSeparatorCharacter: this.useSeparator(),
      appendNumber: this.addNumber(),
      appendSpecialCharacter: this.addSpecialChar(),
      capitalizeFirstWord: this.capitalizeFirst(),
    }));
  }

  public decrementWordCount(): void {
    this.optionsService.decrementWordCount();
  }

  public incrementWordCount(): void {
    this.optionsService.incrementWordCount();
  }

  public copyToClipboard(): void {
    this.clipboard.copy(this.passphraseResult().passphrase);
  }

  public meterSegmentColor(level: number, score: number): string {
    if (score < level) {
      return 'transparent';
    }

    switch (score) {
      case 3:
        return 'green';
      case 2:
        return 'darkseagreen';
      case 1:
        return '#F5DF4D';
      default:
        return 'red';
    }
  }
}
