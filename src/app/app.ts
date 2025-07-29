import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('passphrase-genie');
  wordCount = 5;
  addNumber = false;
  addSpecialChar = false;
  capitalizeFirst = false;
  useSeparator = true;

  wordList = ['sultry', 'overpower', 'operator', 'filing', 'unseated']; // Replace with random generator or service
  passphrase = this.generatePassphrase();
  specialCharacters = "!@#$%^&*()_+~`|}{[]\:;?><,./-=";


  changeWordCount(delta: number) {
    this.wordCount = Math.max(1, this.wordCount + delta);
    this.regenerate();
  }

  regenerate() {
    this.passphrase = this.generatePassphrase();
  }

  generatePassphrase(): string {
    const sampleWords = [...this.wordList];
    const selected = [];
    for (let i = 0; i < this.wordCount; i++) {
      const word = sampleWords[i % sampleWords.length];
      selected.push(i === 0 && this.capitalizeFirst ? this.capitalize(word) : word);
    }
    if (this.addNumber) selected.push(Math.floor(Math.random() * 100).toString());
    if (this.addSpecialChar) selected.push('@');
    return selected.join(this.useSeparator ? '-' : '');
  }

  copy() {
    navigator.clipboard.writeText(this.passphrase);
  }

  capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
