import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OptionsService } from './services';
import Colors from './colors';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatSlideToggleModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = 'Passphrase Genie';
  
  public get wordCount() {
    return this._optionsService.wordCount;
  }
 
  public get addNumber() {
    return this._optionsService.addNumber;
  }

  public get addSpecialChar() {
    return this._optionsService.addSpecialChar;
  }

  public get capitalizeFirst() {
    return this._optionsService.capitalizeFirst;
  }

  public get useSeparator() {
    return this._optionsService.useSeparator;
  }

  public get passphraseResult() {
    return this._optionsService.passphraseResult;
  }

  public constructor(private _optionsService: OptionsService) {}

  changeWordCount(delta: number) {
    this._optionsService.changeWordCount(delta);
  }

  regenerate() {
    this._optionsService.regenerate();
  }

  copy() {
    this._optionsService.copyToClipboard();
  }

  meterSegmentColor(level: number, score: number) {
    if (score < level) {
        return Colors.surfaceBright;
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
