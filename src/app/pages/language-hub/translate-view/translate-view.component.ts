import {Component, OnInit} from '@angular/core';
import {TranslateViewService} from "./translate-view.service";
import {LanguageHubDataService} from "../language-hub-data.service";
import { Location } from "@angular/common";

@Component({
    selector: 'uni-translate-view',
    templateUrl: './translate-view.component.html',
    styleUrls: ['./translate-view.component.scss']
})
export class TranslateViewComponent implements OnInit {
    translatedText = '';
    selectedLanguage: any
    selectedSubmoduleName: any = "";
    selectedLanguageName: any = "";


    constructor(private translateViewService: TranslateViewService, private lhs: LanguageHubDataService,
                private _location: Location) {
        this.lhs.dataLanguageCode$.subscribe((data) => {
            this.selectedLanguage = data
        });
        this.lhs.dataSubmoduleName$.subscribe((data) => {
            this.selectedSubmoduleName = data
        })
        this.lhs.dataLanguageName$.subscribe((data) => {
            this.selectedLanguageName = data
        })
    }

    ngOnInit(): void {
        const value = localStorage.getItem('languageHubData');
        if (value !== null) {
            try {
                this.text1 = JSON.parse(value).english
                this.text3 = JSON.parse(value).englishanswer
                this.translateText(this.text1, this.text3)
            } catch (e) {
                console.error("Failed to parse JSON:", e);
            }
        } else {
            console.log("No data found for 'languageHubData' in localStorage.");
        }
    }

    goBack() {
        this._location.back();
    }

    translateText(text1: any, text2: any) {
        if (text1) {
            this.translateViewService.translate(text1, this.selectedLanguage).subscribe((response: any) => {
                this.text2 = response.data.translations[0].translatedText;
            });
        }
        if (text2) {
            this.translateViewService.translate(text2, this.selectedLanguage).subscribe((response: any) => {
                this.text4 = response.data.translations[0].translatedText;
            });
        }
    }

    synthesizeSpeech(content: any) {
        this.translateViewService.synthesize(content, this.selectedLanguage).subscribe((response: any) => {
            const audioContent = response.audioContent;
            const audioUrl = 'data:audio/mp3;base64,' + audioContent;
            const audio = new Audio(audioUrl);
            audio.play();
            this.isPlaying1 = false;
            this.isPlaying2 = false;
            this.isPlaying3 = false;
            this.isPlaying4 = false;
        });
    }

    text1: string = '';
    text2: string = '';
    text3: string = '';
    text4: string = '';

    isPlaying1: boolean = false;
    isPlaying2: boolean = false;
    isPlaying3: boolean = false;
    isPlaying4: boolean = false;

    togglePlayPause(textAreaNumber: number, content: any) {
        switch (textAreaNumber) {
            case 1:
                this.isPlaying1 = !this.isPlaying1;
                this.synthesizeSpeech(content)
                break;
            case 2:
                this.isPlaying2 = !this.isPlaying2;
                this.synthesizeSpeech(content)
                break;
            case 3:
                this.isPlaying3 = !this.isPlaying3;
                this.synthesizeSpeech(content)
                break;
            case 4:
                this.isPlaying4 = !this.isPlaying4;
                this.synthesizeSpeech(content)
                break;
        }
    }

    translate(text1: any, text2: any) {
        this.translateText(text1, text2)
    }
}
