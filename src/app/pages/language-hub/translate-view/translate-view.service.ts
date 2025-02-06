import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
    providedIn: 'root'
})
export class TranslateViewService {
    private apiKey = environment.googleCloud.apiKey;
    private urlTTS = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;
    private urlTranslate = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

    constructor(private http: HttpClient) {
    }

    synthesize(text: string, lang: any) {
        const body = {
            input: {text: text},
            voice: {languageCode: lang, ssmlGender: 'FEMALE'},
            audioConfig: {audioEncoding: 'MP3'}
        };
        return this.http.post(this.urlTTS, body);
    }

    translate(text: string, target: string) {
        const body = {
            q: text,
            target: target
        };
        return this.http.post(this.urlTranslate, body);
    }
}
