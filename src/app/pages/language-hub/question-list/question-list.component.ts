import {Component, OnInit} from '@angular/core';
import {LanguageHubService} from "../language-hub.service";
import Speech from "speak-tts";
import {Location} from "@angular/common";

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

    constructor(private lhs: LanguageHubService,
                private location: Location) {
        this.lhs.dataLanguageName$.subscribe((data) => {
            this.selectedLanguageName = data
        })
    }

    loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

    ngOnInit(): void {
        this.heading = this.selectedLanguageName
        const speech = new Speech()
        if (speech.hasBrowserSupport()) { // returns a boolean
            console.log("speech synthesis supported")
        }else {
            console.log('not supported')
        }
        this.lhs.getQuestionList().subscribe((_res) => {
            this.isSkeletonVisible = false
            this.questionListData = _res.questions
        });
    }

    goToHome(event: any) {
        this.location.back();
        //this.isQuestionAnswerVisible = false;
    }

    goBack() {

    }

    viewOneQuestion(data: any) {
        this.isQuestionAnswerVisible = true
        this.oneQuestionContent = data;
        console.log(data);
    }

    paginate(event: any) {

    }

    onShowModal(event: any) {

    }


    voiceOver(voiceData: any) {
        const speech = new Speech()
        speech.init({
            'volume': 1,
            'lang': 'hi-IN',
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
}
