import { App } from './app';
import { OptionsService, PassphraseService } from './services';
import { IPassphraseResult } from './models';
import { Clipboard } from '@angular/cdk/clipboard';

// Simple WritableSignal mock
function createSignal<T>(initial: T): any {
  let value = initial;
  const fn = (v?: T) => (v === undefined ? value : (value = v));
  fn.set = (v: T) => (value = v);
  return fn;
}

describe('App Component', () => {
  let component: App;

  let clipboardServiceSpy: jasmine.SpyObj<Clipboard>;
  let optionsServiceSpy: jasmine.SpyObj<OptionsService>;
  let passphraseServiceSpy: jasmine.SpyObj<PassphraseService>;

  beforeEach(() => {
    clipboardServiceSpy = jasmine.createSpyObj('Clipboard', ['copy']);

    // Mocks for signals
    optionsServiceSpy = jasmine.createSpyObj('OptionsService', [
      'decrementWordCount',
      'incrementWordCount'
    ], {
      wordCount: createSignal<number>(5),
      addNumber: createSignal<boolean>(true),
      addSpecialChar: createSignal<boolean>(true),
      capitalizeFirst: createSignal<boolean>(false),
      useSeparator: createSignal<boolean>(false)
    });

    passphraseServiceSpy = jasmine.createSpyObj('PassphraseService', [
      'generatePassphrase'
    ]);

    // Default result
    const result: IPassphraseResult = <any>{ passphrase: 'alpha-bravo-charlie' };
    passphraseServiceSpy.generatePassphrase.and.returnValue(result);

    // Set up the component
    component = new App(clipboardServiceSpy, optionsServiceSpy, passphraseServiceSpy);
    // Patch passphraseResult signal
    component.passphraseResult.set = jasmine.createSpy('set');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose title', () => {
    expect(component.title).toBe('Passphrase Genie');
  });

  it('should get wordCount signal from optionsService', () => {
    expect(component.wordCount).toBe(optionsServiceSpy.wordCount);
  });

  it('should get addNumber signal from optionsService', () => {
    expect(component.addNumber).toBe(optionsServiceSpy.addNumber);
  });

  it('should get addSpecialChar signal from optionsService', () => {
    expect(component.addSpecialChar).toBe(optionsServiceSpy.addSpecialChar);
  });

  it('should get capitalizeFirst signal from optionsService', () => {
    expect(component.capitalizeFirst).toBe(optionsServiceSpy.capitalizeFirst);
  });

  it('should get useSeparator signal from optionsService', () => {
    expect(component.useSeparator).toBe(optionsServiceSpy.useSeparator);
  });

  it('should generate a passphrase result signal on creation', () => {
    // The initial value will be as mocked in passphraseService
    expect(component.passphraseResult().passphrase).toBe('alpha-bravo-charlie');
  });

  it('regenerate() should call generatePassphrase and update passphraseResult', () => {
    component.regenerate();
    expect(passphraseServiceSpy.generatePassphrase).toHaveBeenCalled();
    expect(component.passphraseResult.set).toHaveBeenCalledWith(jasmine.objectContaining({
      passphrase: 'alpha-bravo-charlie'
    }));
  });

  it('decrementWordCount() should delegate to optionsService', () => {
    component.decrementWordCount();
    expect(optionsServiceSpy.decrementWordCount).toHaveBeenCalled();
  });

  it('incrementWordCount() should delegate to optionsService', () => {
    component.incrementWordCount();
    expect(optionsServiceSpy.incrementWordCount).toHaveBeenCalled();
  });

  it('should call Clipboard copy', () => {
    component.copyToClipboard();
    expect(clipboardServiceSpy.copy).toHaveBeenCalled();
  });


  describe('meterSegmentColor()', () => {
    it('returns "transparent" if score < level', () => {
      expect(component.meterSegmentColor(2, 1)).toBe('transparent');
    });

    it('returns "green" for score 3', () => {
      expect(component.meterSegmentColor(1, 3)).toBe('green');
    });

    it('returns "darkseagreen" for score 2', () => {
      expect(component.meterSegmentColor(1, 2)).toBe('darkseagreen');
    });

    it('returns "#F5DF4D" for score 1', () => {
      expect(component.meterSegmentColor(1, 1)).toBe('#F5DF4D');
    });

    it('returns "red" for score 0', () => {
      expect(component.meterSegmentColor(0, 0)).toBe('red');
    });
  });
});
