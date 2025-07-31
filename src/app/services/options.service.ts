import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  public readonly wordCount: WritableSignal<number> = signal<number>(5);
  public readonly addNumber: WritableSignal<boolean> = signal<boolean>(true);
  public readonly addSpecialChar: WritableSignal<boolean> = signal<boolean>(true);
  public readonly capitalizeFirst: WritableSignal<boolean> = signal<boolean>(true);
  public readonly useSeparator: WritableSignal<boolean> = signal<boolean>(true);

  public decrementWordCount() {
    this.wordCount.update(x => Math.max(1, x - 1));
  }

  public incrementWordCount() {
    this.wordCount.update(x => Math.max(1, x + 1));
  }
}
