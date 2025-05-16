import { AbstractControl, ValidationErrors } from "@angular/forms";

export function maxWordsValidator(maxWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        const parser = new DOMParser();
        const doc = parser.parseFromString(control.value, 'text/html');
        const plainText = doc.body.textContent || '';
        const wordCount = (plainText.match(/\b\w+\b/g) || []).length;

        return wordCount > maxWords ? {
            maxWords: { actual: wordCount, max: maxWords }
        } : null;
    };
}


export function maxCharactersValidator(maxChars: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(control.value, 'text/html');
    const plainText = doc.body.textContent || '';
    const charCount = plainText.length;

    return charCount > maxChars ? {
      maxCharacters: { actual: charCount, max: maxChars }
    } : null;
  };
}