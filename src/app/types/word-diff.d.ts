declare module 'word-diff' {
    const WordDiff: {
        diffString(oldStr: string, newStr: string): string;
        diff(oldWords: string[], newWords: string[]): any[];
        createPatch(oldStr: string, newStr: string): string;
    };
    export = WordDiff;
} 