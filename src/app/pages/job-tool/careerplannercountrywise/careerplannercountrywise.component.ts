import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestQuizService } from '../test-quiz.service';
import { JobSearchService } from '../../job-search/job-search.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelCostEstimator } from 'src/app/@Models/chat-gpt.model';
import { PageFacadeService } from '../../page-facade.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-careerplannercountrywise',
  templateUrl: './careerplannercountrywise.component.html',
  styleUrls: ['./careerplannercountrywise.component.scss']
})
export class CareerplannercountrywiseComponent implements OnInit {
  countries:any=[];
  form:FormGroup;
  submitted: boolean = false;
  isFormVisible:boolean=true;
  customizedResponse: any;
  isFormChatgptresponse:boolean=false;
  isSavedResponse:boolean=false;
  recommadationSavedQuestionList: any[] = [];
  constructor(private router: Router,private service: JobSearchService,private fb:FormBuilder,private pageFacade: PageFacadeService,
    private toast: MessageService
  ) { 
    this.form = this.fb.group({
      country: ['',[Validators.required]],
      currency: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.service.getCountryCurrency().subscribe((res:any)=>{
      this.countries=res
    })
  }
  get f() {
    return this.form.controls;
  }
  formSubmit(){
    this.submitted=true;
    if(this.form.valid){
      var data={
        mode:"careerplanner",
        currency_code:this.form.value.currency,
        country :this.form.value.country
      }
      this.service.getCountryCurrencyChatGptOutput(data).subscribe((res:any)=>{
        this.customizedResponse=res.response
        this.submitted=false
        this.isFormVisible=false;
        this.isFormChatgptresponse=true;
        this.isSavedResponse=false;
      })
    }
  }
  BackReset(){
    this.isFormVisible=true;
    this.isFormChatgptresponse=false;
    this.isSavedResponse=false;
    this.form.reset();
  }
  saveRecommadation(){
    this.service.getTripList('careerplanner').subscribe({
      next: response => {
        this.isFormVisible=false;
        this.isFormChatgptresponse=false;
        this.isSavedResponse=true;
        this.recommadationSavedQuestionList = response.data;
      },
      error: error => {
      }
    });
  }
  goBackChatGptResp(){
    this.isFormVisible=false;
    this.isFormChatgptresponse=true;
    this.isSavedResponse=false;
  }
  showRecommandationData(data:any){
    this.customizedResponse=data
    this.isFormVisible=false;
    this.isFormChatgptresponse=true;
    this.isSavedResponse=false;
  }
  goBackcareerPlanList(){
    this.router.navigate(['/pages/job-tool/careerplannerlist']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }
  downloadRecommadation() {
    this.service.downloadRecommendation({ data: this.customizedResponse }).subscribe({
      next: res => {
        window.open(res.url, "_blank");
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }
}
