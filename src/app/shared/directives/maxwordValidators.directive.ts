import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxWordsValidator(maxWords: number = 150): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const words = control.value.replace(/<\/?[^>]+(>|$)/g, '').match(/\b\w+\b/g) || [];
      const wordCount = words.length;
      return wordCount > maxWords ? { maxWordsExceeded: true } : null;
    }
    return null;
  };
}