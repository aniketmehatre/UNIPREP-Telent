import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestQuizService } from '../test-quiz.service';
import { JobSearchService } from '../../job-search/job-search.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private router: Router,private service: JobSearchService,private fb:FormBuilder) { 
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
      this.submitted=false
      this.isFormVisible=false
      var data={
        mode:"careerplanner",
        currency_code:this.form.value.currency,
        country :this.form.value.country
      }
      this.service.getCountryCurrencyChatGptOutput(data).subscribe((res:any)=>{
        console.log(res);
        this.customizedResponse=res.response
        this.submitted=false;
      })
    }
  }
}
