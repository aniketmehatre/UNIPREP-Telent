import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LanguageHubService } from "../language-hub.service";
import Speech from "speak-tts";
import { Location } from "@angular/common";
import { LanguageHubDataService } from "../language-hub-data.service";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { PageFacadeService } from "../../page-facade.service";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { Observable } from "rxjs";
import { ReadQuestion } from "../../../@Models/read-question.model";
import { LanguageArrayGlobalService } from "../language-array-global.service";
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { CarouselModule } from "primeng/carousel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { StorageService } from "../../../services/storage.service";
@Component({
  selector: "uni-question-list",
  templateUrl: "./question-list.component.html",
  styleUrls: ["./question-list.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, PaginatorModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class QuestionListComponent implements OnInit {
  jsonData: any = [
    {
      "en-IN": "Rishi",
    },
    {
      "en-US": "Aaron",
    },
    {
      "en-US": "Albert",
    },
    {
      "it-IT": "Alice",
    },
    {
      "sv-SE": "Alva",
    },
    {
      "fr-CA": "Amélie",
    },
    {
      "ms-MY": "Amira",
    },
    {
      "de-DE": "Anna",
    },
    {
      "en-GB": "Arthur",
    },
    {
      "en-US": "Bad News",
    },
    {
      "en-US": "Bahh",
    },
    {
      "en-US": "Bells",
    },
    {
      "en-US": "Boing",
    },
    {
      "en-US": "Bubbles",
    },
    {
      "he-IL": "Carmit",
    },
    {
      "en-AU": "Catherine",
    },
    {
      "en-US": "Cellos",
    },
    {
      "id-ID": "Damayanti",
    },
    {
      "en-GB": "Daniel (English (United Kingdom))",
    },
    {
      "fr-FR": "Daniel (French (France))",
    },
    {
      "bg-BG": "Daria",
    },
    {
      "de-DE": "Eddy (German (Germany))",
    },
    {
      "en-GB": "Eddy (English (United Kingdom))",
    },
    {
      "en-US": "Eddy (English (United States))",
    },
    {
      "es-ES": "Eddy (Spanish (Spain))",
    },
    {
      "es-MX": "Eddy (Spanish (Mexico))",
    },
    {
      "fi-FI": "Eddy (Finnish (Finland))",
    },
    {
      "fr-CA": "Eddy (French (Canada))",
    },
    {
      "fr-FR": "Eddy (French (France))",
    },
    {
      "it-IT": "Eddy (Italian (Italy))",
    },
    {
      "pt-BR": "Eddy (Portuguese (Brazil))",
    },
    {
      "nl-BE": "Ellen",
    },
    {
      "de-DE": "Flo (German (Germany))",
    },
    {
      "en-GB": "Flo (English (United Kingdom))",
    },
    {
      "en-US": "Flo (English (United States))",
    },
    {
      "es-ES": "Flo (Spanish (Spain))",
    },
    {
      "es-MX": "Flo (Spanish (Mexico))",
    },
    {
      "fi-FI": "Flo (Finnish (Finland))",
    },
    {
      "fr-CA": "Flo (French (Canada))",
    },
    {
      "fr-FR": "Flo (French (France))",
    },
    {
      "it-IT": "Flo (Italian (Italy))",
    },
    {
      "pt-BR": "Flo (Portuguese (Brazil))",
    },
    {
      "en-US": "Fred",
    },
    {
      "en-US": "Good News",
    },
    {
      "en-AU": "Gordon",
    },
    {
      "de-DE": "Grandma (German (Germany))",
    },
    {
      "en-GB": "Grandma (English (United Kingdom))",
    },
    {
      "en-US": "Grandma (English (United States))",
    },
    {
      "es-ES": "Grandma (Spanish (Spain))",
    },
    {
      "es-MX": "Grandma (Spanish (Mexico))",
    },
    {
      "fi-FI": "Grandma (Finnish (Finland))",
    },
    {
      "fr-CA": "Grandma (French (Canada))",
    },
    {
      "fr-FR": "Grandma (French (France))",
    },
    {
      "it-IT": "Grandma (Italian (Italy))",
    },
    {
      "pt-BR": "Grandma (Portuguese (Brazil))",
    },
    {
      "de-DE": "Grandpa (German (Germany))",
    },
    {
      "en-GB": "Grandpa (English (United Kingdom))",
    },
    {
      "en-US": "Grandpa (English (United States))",
    },
    {
      "es-ES": "Grandpa (Spanish (Spain))",
    },
    {
      "es-MX": "Grandpa (Spanish (Mexico))",
    },
    {
      "fi-FI": "Grandpa (Finnish (Finland))",
    },
    {
      "fr-CA": "Grandpa (French (Canada))",
    },
    {
      "fr-FR": "Grandpa (French (France))",
    },
    {
      "it-IT": "Grandpa (Italian (Italy))",
    },
    {
      "pt-BR": "Grandpa (Portuguese (Brazil))",
    },
    {
      "ja-JP": "Hattori",
    },
    {
      "de-DE": "Helena",
    },
    {
      "ro-RO": "Ioana",
    },
    {
      "fr-FR": "Jacques",
    },
    {
      "en-US": "Jester",
    },
    {
      "pt-PT": "Joana",
    },
    {
      "en-US": "Junior",
    },
    {
      "th-TH": "Kanya",
    },
    {
      "en-AU": "Karen",
    },
    {
      "en-US": "Kathy",
    },
    {
      "ja-JP": "Kyoko",
    },
    {
      "hr-HR": "Lana",
    },
    {
      "sk-SK": "Laura",
    },
    {
      "uk-UA": "Lesya",
    },
    {
      "zh-CN": "Li-Mu",
    },
    {
      "vi-VN": "Linh",
    },
    {
      "pt-BR": "Luciana",
    },
    {
      "ar-001": "Majed",
    },
    {
      "fr-FR": "Marie",
    },
    {
      "en-GB": "Martha",
    },
    {
      "de-DE": "Martin",
    },
    {
      "zh-TW": "Meijia",
    },
    {
      "el-GR": "Melina",
    },
    {
      "ru-RU": "Milena",
    },
    {
      "en-IE": "Moira",
    },
    {
      "ca-ES": "Montse",
    },
    {
      "es-ES": "Mónica",
    },
    {
      "en-US": "Nicky",
    },
    {
      "nb-NO": "Nora",
    },
    {
      "ja-JP": "O-Ren",
    },
    {
      "en-US": "Organ",
    },
    {
      "es-MX": "Paulina",
    },
    {
      "en-US": "Ralph",
    },
    {
      "de-DE": "Reed (German (Germany))",
    },
    {
      "en-GB": "Reed (English (United Kingdom))",
    },
    {
      "en-US": "Reed (English (United States))",
    },
    {
      "es-ES": "Reed (Spanish (Spain))",
    },
    {
      "es-MX": "Reed (Spanish (Mexico))",
    },
    {
      "fi-FI": "Reed (Finnish (Finland))",
    },
    {
      "fr-CA": "Reed (French (Canada))",
    },
    {
      "it-IT": "Reed (Italian (Italy))",
    },
    {
      "pt-BR": "Reed (Portuguese (Brazil))",
    },
    {
      "de-DE": "Rocko (German (Germany))",
    },
    {
      "en-GB": "Rocko (English (United Kingdom))",
    },
    {
      "en-US": "Rocko (English (United States))",
    },
    {
      "es-ES": "Rocko (Spanish (Spain))",
    },
    {
      "es-MX": "Rocko (Spanish (Mexico))",
    },
    {
      "fi-FI": "Rocko (Finnish (Finland))",
    },
    {
      "fr-CA": "Rocko (French (Canada))",
    },
    {
      "fr-FR": "Rocko (French (France))",
    },
    {
      "it-IT": "Rocko (Italian (Italy))",
    },
    {
      "pt-BR": "Rocko (Portuguese (Brazil))",
    },
    {
      "en-US": "Samantha",
    },
    {
      "de-DE": "Sandy (German (Germany))",
    },
    {
      "en-GB": "Sandy (English (United Kingdom))",
    },
    {
      "en-US": "Sandy (English (United States))",
    },
    {
      "es-ES": "Sandy (Spanish (Spain))",
    },
    {
      "es-MX": "Sandy (Spanish (Mexico))",
    },
    {
      "fi-FI": "Sandy (Finnish (Finland))",
    },
    {
      "fr-CA": "Sandy (French (Canada))",
    },
    {
      "fr-FR": "Sandy (French (France))",
    },
    {
      "it-IT": "Sandy (Italian (Italy))",
    },
    {
      "pt-BR": "Sandy (Portuguese (Brazil))",
    },
    {
      "da-DK": "Sara",
    },
    {
      "fi-FI": "Satu",
    },
    {
      "de-DE": "Shelley (German (Germany))",
    },
    {
      "en-GB": "Shelley (English (United Kingdom))",
    },
    {
      "en-US": "Shelley (English (United States))",
    },
    {
      "es-ES": "Shelley (Spanish (Spain))",
    },
    {
      "es-MX": "Shelley (Spanish (Mexico))",
    },
    {
      "fi-FI": "Shelley (Finnish (Finland))",
    },
    {
      "fr-CA": "Shelley (French (Canada))",
    },
    {
      "fr-FR": "Shelley (French (France))",
    },
    {
      "it-IT": "Shelley (Italian (Italy))",
    },
    {
      "pt-BR": "Shelley (Portuguese (Brazil))",
    },
    {
      "zh-HK": "Sinji",
    },
    {
      "en-US": "Superstar",
    },
    {
      "en-ZA": "Tessa",
    },
    {
      "fr-FR": "Thomas",
    },
    {
      "zh-CN": "Tingting",
    },
    {
      "en-US": "Trinoids",
    },
    {
      "hu-HU": "Tünde",
    },
    {
      "en-US": "Whisper",
    },
    {
      "en-US": "Wobble",
    },
    {
      "nl-NL": "Xander",
    },
    {
      "tr-TR": "Yelda",
    },
    {
      "zh-CN": "Yu-shu",
    },
    {
      "ko-KR": "Yuna",
    },
    {
      "en-US": "Zarvox",
    },
    {
      "pl-PL": "Zosia",
    },
    {
      "cs-CZ": "Zuzana",
    },
    {
      "de-DE": "Google Deutsch",
    },
    {
      "en-US": "Google US English",
    },
    {
      "en-GB": "Google UK English Female",
    },
    {
      "en-GB": "Google UK English Male",
    },
    {
      "es-ES": "Google español",
    },
    {
      "hi-IN": "Google हिन्दी",
    },
    {
      "es-US": "Google español de Estados Unidos",
    },
    {
      "fr-FR": "Google français",
    },
    {
      "id-ID": "Google Bahasa Indonesia",
    },
    {
      "it-IT": "Google italiano",
    },
    {
      "ja-JP": "Google 日本語",
    },
    {
      "ko-KR": "Google 한국의",
    },
    {
      "nl-NL": "Google Nederlands",
    },
    {
      "pl-PL": "Google polski",
    },
    {
      "pt-BR": "Google português do Brasil",
    },
    {
      "ru-RU": "Google русский",
    },
    {
      "zh-CN": "Google&nbsp;普通话（中国大陆）",
    },
    {
      "zh-HK": "Google&nbsp;粤語（香港）",
    },
    {
      "zh-TW": "Google 國語（臺灣）",
    },
  ];
  isSkeletonVisible: boolean = true;
  isQuestionAnswerVisible: boolean = false;
  questionListData: any;
  totalQuestionCount: any;
  oneQuestionContent: any;
  heading: string = "";
  selectedLanguageName: any;
  selectedLanguageId: any;
  selectedLanguageType: any;
  selectedLanguageCode: any;
  breadCrumb: MenuItem[] = [];
  selectedCategoryId: any;
  selectedSubmoduleName: any = "";
  langType: any;
  page: number = 1;
  perpage: number = 25;
  readQue$!: Observable<ReadQuestion[]>;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  langName: string = "";
  speech: any;
  voices: SpeechSynthesisVoice[] = [];
  speechSynthesis = window.speechSynthesis;
  currentUtterance: SpeechSynthesisUtterance | null = null;
  isPlaying = false;
  isPaused = false;
  currentText: string | null = null;
  currentId: string | null = null;
  constructor(private languageHubService: LanguageHubService, private lhs: LanguageHubDataService,
    private location: Location, private route: ActivatedRoute, private toast: MessageService, private router: Router,
    private pageFacade: PageFacadeService, private languageArrayGlobalService: LanguageArrayGlobalService,
    private moduleListService: ModuleServiceService, private storage: StorageService) {
    this.lhs.data$.subscribe((data) => {
      this.selectedLanguageId = data;
    });
    this.lhs.dataLanguageName$.subscribe((data) => {
      this.selectedLanguageName = data;
    });
    this.lhs.dataLanguageType$.subscribe((data) => {
      this.selectedLanguageType = data;
    });
    this.lhs.dataLanguageCode$.subscribe((data) => {
      this.selectedLanguageCode = data;
    });
    this.lhs.dataLanguageTypeName$.subscribe((data) => {
      this.langType = data;
    });
    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params["id"];
    });
    this.lhs.dataSubmoduleName$.subscribe((data) => {
      this.selectedSubmoduleName = data;
    });
  }

  ngOnInit(): void {
    this.heading = this.selectedLanguageName;
    this.speech = new Speech();
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    } else {
      console.log("not supported");
    }
    this.speech
      .init({
        volume: 1,
        lang: "en-US",
        rate: 1,
        pitch: 1,
        voice: "Google US English",
        splitSentences: true,
        listeners: {
          onvoiceschanged: (voices: any) => {
            // console.log("Event voiceschanged", voices
          },
        },
      })
      .then((data: any) => {
        // console.log('Speech is ready, voices are available', data.voices);
      })
      .catch((e: any) => {
        console.error("An error occurred :", e);
      });

    this.jsonData.forEach((data: any) => {
      if (data[this.selectedLanguageCode] !== undefined) {
        this.langName = data[this.selectedLanguageCode];
      }
    });
    this.init();

    this.breadCrumb = [
      {
        label: "LANGUAGE HUB",
        command: (event: any) => this.gotoLanguageHubMain(),
      },
      {
        label: this.selectedLanguageName.toUpperCase(),
        command: (event: any) => this.goToHomebreadcrump(),
      },
      { label: this.langType },
      { label: `Question` },
    ];
  }

  init() {
    let req = {
      languageid: this.selectedLanguageId,
      languagetype: this.selectedLanguageType,
      submoduleid: this.selectedCategoryId,
      perpage: this.perpage,
      page: this.page,
    };
    this.languageHubService.getQuestionList(req).subscribe(
      (_res) => {
        this.isSkeletonVisible = false;
        this.totalQuestionCount = _res.count;
        this.questionListData = _res.questions;
      },
      (error) => {
        this.location.back();
        this.toast.add({ severity: "info", summary: "Info", detail: "No Data Found" });
        console.error("Error:", error);
      }
    );
  }

  getFormattedValues(): string {
    return this.languageArrayGlobalService.getItems().join(" > ");
  }

  goToBack(event: any) {
    this.isQuestionAnswerVisible = false;
  }

  goToHome(event: any) {
    this.languageArrayGlobalService.removeItem(this.languageArrayGlobalService.getItems().length - 1);
    this.location.back();
  }

  gotoLanguageHubMain() { }

  goToHomebreadcrump() { }

  viewOneQuestion(data: any) {
    this.storage.set("languageHubData", JSON.stringify(data));
    this.router.navigateByUrl(`/pages/language-hub/translate-view`);
    return;

    this.readQuestion(data);
    this.isQuestionAnswerVisible = true;
    this.oneQuestionContent = data;
  }

  onShowModal(event: any) { }

  voiceOverEnglish(id: string, text: string) {
    if (this.currentId === id) {
      if (this.isPlaying && !this.isPaused) {
        this.pauseVoiceOver();
      } else if (this.isPaused) {
        this.resumeVoiceOver();
      } else {
        this.playVoiceOver(id, text);
      }
    } else {
      this.stopVoiceOver();
      this.playVoiceOver(id, text);
    }
    this.currentText = text;
    this.currentId = id;
  }

  playVoiceOver(id: string, text: string) {
    this.stopVoiceOver();
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentText = null;
      this.currentId = null;
    };
    this.speechSynthesis.speak(this.currentUtterance);
    this.isPlaying = true;
    this.isPaused = false;
  }

  pauseVoiceOver() {
    this.speechSynthesis.pause();
    this.isPaused = true;
  }

  resumeVoiceOver() {
    this.speechSynthesis.resume();
    this.isPaused = false;
  }

  stopVoiceOver() {
    if (this.speechSynthesis.speaking || this.speechSynthesis.paused) {
      this.speechSynthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  // voiceOverEnglish(voiceData: any) {
  //     let lName = 'Google US English';
  //     let lCode = 'en-US'
  //     if (this.deviceService.browser == 'Safari') {
  //         lName = 'Samantha'
  //     } else if (this.deviceService.browser == 'Chrome') {
  //         if (this.deviceService.isMobile()){
  //             lCode = 'en_US'
  //             lName = 'English United States'
  //         }else{
  //             lName = 'Google US English'
  //         }
  //     }else if (this.deviceService.browser == 'MS-Edge-Chromium' || this.deviceService.browser == 'Opera') {
  //         lName = 'Microsoft Zira - English (United States)'
  //     }
  //     this.speech.setLanguage(lCode)
  //     this.speech.setVoice(lName)
  //
  //     this.speech.speak({
  //         text: voiceData,
  //     }).then((data: any) => {
  //         console.log('Speech is ready, voices are available', data);
  //     }).catch((e: any) => {
  //         console.error("An error occurred :", e)
  //     })
  // }

  voiceOverNative(voiceData: any, fullData: any) {
    var voiceName = "";
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: "en_IN",
        rate: 1,
        pitch: 1,
        voice: "English India",
        splitSentences: true,
        listeners: {
          onvoiceschanged: (voices: any) => {
            console.log("Event voiceschanged", voices);
          },
        },
      })
      .then((data: any) => {
        console.log("Speech is ready, voices are available", data);
      })
      .catch((e: any) => {
        console.error("An error occurred :", e);
      });
    speech.setLanguage("en_IN");
    speech.setVoice("English India");
    speech
      .speak({
        text: voiceData,
      })
      .then(() => {
        console.log("Success !");
      })
      .catch((e: any) => {
        console.error("An error occurred :", e);
      });
  }

  onClickAsk() {
    this.router.navigateByUrl(`/pages/chat`);
  }

  reviewBy() { }

  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.init();
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("language-hub");
  }

  readQuestion(data: any) {
    let req = {
      countryId: 0,
      questionId: data.id,
      moduleId: 9,
      submoduleId: data.submodule_id,
    };
    this.moduleListService.readQuestion(req);
    this.readQue$ = this.moduleListService.readQuestionMessage$();
    this.init();
  }
}
