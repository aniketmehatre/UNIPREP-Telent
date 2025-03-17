import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobSearchService } from '../../job-search/job-search.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';

import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { EducationToolsService } from '../../education-tools/education-tools.service';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'uni-careerplannercountrywise',
    templateUrl: './careerplannercountrywise.component.html',
    styleUrls: ['./careerplannercountrywise.component.scss'],
    standalone: true,
    imports: [CommonModule,DialogModule, SidebarModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})

export class CareerplannercountrywiseComponent implements OnInit {
  countries: any = [];
  form: FormGroup;
  submitted: boolean = false;
  isFormVisible: boolean = true;
  customizedResponse: SafeHtml;
  isFormChatgptresponse: boolean = false;
  isSavedResponse: boolean = false;
  recommadationSavedQuestionList: any[] = [];
  specializationList: any = [];
  constructor(private router: Router, private service: JobSearchService, private fb: FormBuilder, private pageFacade: PageFacadeService,
    private toast: MessageService, private travelToolService: TravelToolsService,private educationService: EducationToolsService, private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      country: ['', [Validators.required]],
      specialization_name:['',[Validators.required]],
      // currency: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.service.getCountryCurrency().subscribe((res: any) => {
      this.countries = res
    })

    this.educationService.getcareerPlannerSpec().subscribe({
      next: response =>{
        // console.log(response);
        this.specializationList = response;
      }
    })
  }
  get f() {
    return this.form.controls;
  }
  formSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      var data = {
        mode: "careerplanner",
        // currency_code: this.form.value.currency,
        country: this.form.value.country,
        specialization_name: this.form.value.specialization_name
      }
      this.service.getCountryCurrencyChatGptOutput(data).subscribe((res: any) => {

        let chatGptResponse = res.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g,'');
				this.customizedResponse = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
        this.submitted = false
        this.isFormVisible = false;
        this.isFormChatgptresponse = true;
        this.isSavedResponse = false;
      })
    }
  }
  BackReset() {
    this.isFormVisible = true;
    this.isFormChatgptresponse = false;
    this.isSavedResponse = false;
    this.form.reset();
  }
  saveRecommadation() {
    this.service.getTripList('careerplanner').subscribe({
      next: response => {
        this.isFormVisible = false;
        this.isFormChatgptresponse = false;
        this.isSavedResponse = true;
        this.recommadationSavedQuestionList = response.data;
      },
      error: error => {
      }
    });
  }
  goBackChatGptResp() {
    this.isFormVisible = false;
    this.isFormChatgptresponse = true;
    this.isSavedResponse = false;
  }
  showRecommandationData(data: any) {
    this.customizedResponse = data
    this.isFormVisible = false;
    this.isFormChatgptresponse = true;
    this.isSavedResponse = false;
  }
  goBackcareerPlanList() {
    this.router.navigate(['/pages/job-tool/careerplannerlist']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }
  downloadRecommadation() {
    // this.service.downloadRecommendation({ data: this.customizedResponse }).subscribe({
    //   next: res => {
    //     window.open(res.url, "_blank");
    //   },
    //   error: err => {
    //     console.log(err?.error?.message);
    //   }
    // });
    // let downloadString:string = "This is a paragraph with some text and emojis 😊🎉. Markdown processing with emojis works!";
    let selectedCityAndCountry = this.form.value.country;
    let specialization_name = this.form.value.specialization_name;

    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Career Planner</h2>
				</div>
			</div>
          <p><strong>Input:<br></strong></p>
          <p style="color: #d32f2f;"><strong>Which country are you interested in pursuing your career?</strong></p>
          <p>${selectedCityAndCountry}</p><br>
          <p style="color: #d32f2f;"><strong>Select Your Specialization</strong></p>
          <p>${specialization_name}</p>
          <br>
          <div class="divider"></div>
          <p><strong>Response:<br></strong></p>
          ${this.customizedResponse}
        `;
        addingInput = addingInput
			.replace(/```html|```/g, '') 
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g,'')
			.replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.
    let paramData: DownloadRespose = {
      response: addingInput,
      module_name: "Career Planner",
      file_name: "career_planner"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }
}
