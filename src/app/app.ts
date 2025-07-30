import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { generatePassphrase } from './generatePassphrase';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatSlideToggleModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = 'Passphrase Genie';
  wordCount = 5;
  addNumber = false;
  addSpecialChar = false;
  capitalizeFirst = false;
  useSeparator = true;

  passphrase = this.generatePassphrase();

  changeWordCount(delta: number) {
    this.wordCount = Math.max(1, this.wordCount + delta);
    this.regenerate();
  }

  regenerate() {
    this.passphrase = this.generatePassphrase();
  }

  generatePassphrase(): string {
    return generatePassphrase({
        numberWords: this.wordCount,
        useSeparatorCharacter: this.useSeparator,
        appendNumber: this.addNumber,
        appendSpecialCharacter: this.addSpecialChar,
        capitalizeFirstWord: this.capitalizeFirst,
    }).passphrase;
  }

  copy() {
    navigator.clipboard.writeText(this.passphrase);
  }

  capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
