import { Component, OnInit } from '@angular/core';
import {LanguageHubService} from "../language-hub.service";

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

  constructor(private languageHubService: LanguageHubService) { }

  loopRange = Array.from({length: 30}).fill(0).map((_, index) => index);

  ngOnInit(): void {
    this.languageHubService.getCategoryList().subscribe((_res) => {
      this.isSkeletonVisible = false
      this.questionListData = _res.data
    });
  }

  goToHome(event: any) {
    //this.isQuestionAnswerVisible = false;
  }

  goBack(){

  }

  viewOneQuestion(data: any){

  }

  paginate(event: any){

  }

  onShowModal(event: any){

  }
}
