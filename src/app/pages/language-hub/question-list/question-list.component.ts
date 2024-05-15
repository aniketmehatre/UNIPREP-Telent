import { Component, OnInit } from '@angular/core';
import { LanguageHubService } from "../language-hub.service";
import Speech from "speak-tts";
import { Location } from "@angular/common";
import { LanguageHubDataService } from "../language-hub-data.service";
import {MenuItem, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'uni-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

    isSkeletonVisible: boolean = true;
    isQuestionAnswerVisible: boolean = false;
    questionListData: any;
    totalQuestionCount: any
    oneQuestionContent: any
    heading: string = ''
    selectedLanguageName: any
    selectedLanguageId: any
    selectedLanguageType: any
    selectedLanguageCode: any
    breadCrumb: MenuItem[] = []
    selectedCategoryId: any
    page: number = 1
    perpage: number = 25

    constructor(private languageHubService: LanguageHubService, private lhs: LanguageHubDataService,
        private location: Location, private route: ActivatedRoute, private toast: MessageService,
                private router: Router) {
        this.lhs.data$.subscribe((data) => {
            this.selectedLanguageId = data
        })
        this.lhs.dataLanguageName$.subscribe((data) => {
            this.selectedLanguageName = data
        })
        this.lhs.dataLanguageType$.subscribe((data) => {
            this.selectedLanguageType = data
        })
        this.lhs.dataLanguageCode$.subscribe((data) => {
            this.selectedLanguageCode = data
        })
        this.route.params.subscribe(params => {
            this.selectedCategoryId = params['id']

          });
    }

    loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.heading = this.selectedLanguageName
        const speech = new Speech()
        if (speech.hasBrowserSupport()) { // returns a boolean
            console.log("speech synthesis supported")
        } else {
            console.log('not supported')
        }

        this.init();

        var langType = ''
        switch (this.selectedLanguageType) {
            case '1':
                langType = 'Basics';
                break;
            case '2':
                langType = 'Intermediate';
                break;
            case '3':
                langType = 'Advanced';
                break;
            default:
                break;
        }

        this.breadCrumb = [
            {
                label: 'LANGUAGE HUB',
                command: (event: any) => this.gotoLanguageHubMain(),
            },
            {
                label: this.selectedLanguageName.toUpperCase(),
                command: (event: any) => this.goToHomebreadcrump()
            },
            { label: langType.toUpperCase() },
            { label: `Question` },
        ];
    }

    init(){
        let req = {
            languageid: this.selectedLanguageId,
            languagetype: this.selectedLanguageType,
            submoduleid: this.selectedCategoryId,
            perpage: this.perpage,
            page: this.page
        }
        this.languageHubService.getQuestionList(req).subscribe((_res) => {
                this.isSkeletonVisible = false
                this.totalQuestionCount = _res.count;
                this.questionListData = _res.questions
            },
            (error) => {
                this.location.back();
                this.toast.add({ severity: 'info', summary: 'Info', detail: 'No Data Found' });
                console.error('Error:', error);
            });
    }

    goToBack(event: any) {
        this.isQuestionAnswerVisible = false;
    }

    goToHome(event: any) {
        this.location.back();

    }

    gotoLanguageHubMain() {

    }

    goToHomebreadcrump() {

    }

    viewOneQuestion(data: any) {
        this.isQuestionAnswerVisible = true
        this.oneQuestionContent = data;
        console.log(data);
    }

    onShowModal(event: any) {

    }


    voiceOver(voiceData: any) {
        const speech = new Speech()
        speech.init({
            'volume': 1,
            'lang': 'en-IN',
            'rate': 1,
            'pitch': 1,
            'voice': 'Google UK English Female',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices: any) => {
                    console.log("Event voiceschanged", voices)
                }
            }
        })
        speech.setVoice('Google UK English Female');
        speech.speak({
            text: voiceData,
        }).then(() => {
            console.log("Success !")
        }).catch((e: any) => {
            console.error("An error occurred :", e)
        })
    }

    voiceOverNative(voiceData: any, fullData: any) {
    console.log(this.selectedLanguageCode)
        const speech = new Speech()
        speech.init({
            'volume': 1,
            'lang': this.selectedLanguageCode,
            'rate': 1,
            'pitch': 1,
            // 'voice': langName,
            // 'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices: any) => {
                    console.log("Event voiceschanged", voices)
                }
            }
        })
        speech.setLanguage(this.selectedLanguageCode)
        speech.setVoice('Majed');
        speech.speak({
            text: voiceData,
        }).then(() => {
            console.log("Success !")
        }).catch((e: any) => {
            console.error("An error occurred :", e)
        })
    }

    onClickAsk() {
        this.router.navigateByUrl(`/pages/chat`);
    }

    reviewBy(){

    }

    paginate(event: any) {
        this.page = event.page + 1;
        this.perpage = event.rows;
        this.init();
    }


}
