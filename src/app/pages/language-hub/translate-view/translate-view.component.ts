import { Component, OnInit } from '@angular/core';
import {TranslateViewService} from "./translate-view.service";
import {LanguageHubDataService} from "../language-hub-data.service";

@Component({
  selector: 'uni-translate-view',
  templateUrl: './translate-view.component.html',
  styleUrls: ['./translate-view.component.scss']
})
export class TranslateViewComponent implements OnInit {
  text = 'Hello, how are you?';
  translatedText = '';
  audioUrl: string | null = null;
  selectedLanguage: any
  selectedSubmoduleName: any = "";
  selectedLanguageName: any = "";

  greetingQuestion: string = '';
  greetingAnswer: string = '';
  kannadaGreetingQuestion: string = '';
  kannadaGreetingAnswer: string = '';



  constructor(private translateViewService: TranslateViewService, private lhs: LanguageHubDataService) {
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
  }

  goBack(){

  }

  translateText() {
    this.translateViewService.translate(this.text, 'es').subscribe((response: any) => {
      this.translatedText = response.data.translations[0].translatedText;
    });
  }

  synthesizeSpeech() {
    this.translateViewService.synthesize(this.text, this.selectedLanguage).subscribe((response: any) => {
      const audioContent = response.audioContent;
      this.audioUrl = 'data:audio/mp3;base64,' + audioContent;
    });
  }

}
