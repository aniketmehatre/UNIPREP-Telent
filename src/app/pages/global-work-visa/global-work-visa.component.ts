import { Component, OnInit } from "@angular/core";
import { GlobalworkvisaService } from "../global-work-visa/global-work-visa.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Meta } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { DataService } from "src/app/data.service";
import { Carousel } from "primeng/carousel";
import { Select, SelectModule } from "primeng/select";
import { NgClass, CommonModule } from "@angular/common";
import { Dialog, DialogModule } from "primeng/dialog";
import { Card } from "primeng/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { AuthService } from "src/app/Auth/auth.service";
import { SocialShareService } from "src/app/shared/social-share.service";
import { PageFacadeService } from "../page-facade.service";

@Component({
  selector: "uni-global-work-visa",
  templateUrl: "./global-work-visa.component.html",
  styleUrls: ["./global-work-visa.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    Carousel,
    RouterModule,
    SelectModule,
    NgClass,
    DialogModule,
    Card,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class GlobalWorkVisaComponent implements OnInit {
  recommendations: { id: number; question: string }[] = [
    { id: 1, question: "Select Your Nationality?" },
    { id: 2, question: "Select the country you are looking for?" },
    // { id: 3, question: "Select your residential status of Country?" }
  ];
  residentStatus: { value: string; label: string }[] = [
    { value: "Resident", label: "Resident" },
    { value: "Non-Resident", label: "Non-Resident" },
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  allCountries: any[] = [];
  visaCountries: any[] = [];
  invalidClass: boolean = false;
  title: string = "Global Work Visa";
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  isRecommendationEachVisaNameData: boolean = false;
  recommendationDataList: any[] = [];
  recomendationData: any[] = [];
  modeName: any;

  eachVisaQuestionCategory: any[] = [];
  isQuestionAnswerVisible: boolean = false;
  selectedQuestionData: any;
  selectedVisaName: string = "";
  selectedVisaCategory: string = "";
  paramData = {
    country_id: 0,
    nationality: 0,
    visa_type_id: 0,
    category_id: 0,
    question_id: 0
  };

  constructor(
    private service: GlobalworkvisaService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,
    private dataService: DataService,
    private authService: AuthService,
    protected socialShareService: SocialShareService,
    private route: ActivatedRoute,
    private pageFacade: PageFacadeService
  ) { }

  ngOnInit(): void {
    this.getCountriesList();
    this.getVisaCountriesList();
    const nationalityId = Number(this.route.snapshot.paramMap.get("nationalityId"));
    const countryId = Number(this.route.snapshot.paramMap.get("countryId"));
    const visaTypeId = Number(this.route.snapshot.paramMap.get("visaTypeId"));
    const categoryId = Number(this.route.snapshot.paramMap.get("categoryId"));
    const questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    if (questionId) {
      this.paramData = {
        country_id: countryId,
        nationality: nationalityId,
        visa_type_id: visaTypeId,
        category_id: categoryId,
        question_id: questionId,
      };
      let categoryData = { id: categoryId, category_name: '' };
      this.viewQuestions(categoryData);
    }
  }
  getCountriesList() {
    this.service.getNationalityList().subscribe((response) => {
      this.allCountries = response;
    });
  }
  getVisaCountriesList() {
    this.service.getVisaCountriesList().subscribe((response: any) => {
      this.visaCountries = response;
    });
  }
  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.invalidClass = !(itemId in this.selectedData);
    if (!this.invalidClass) {
      this.activePageIndex < this.recommendations.length - 1
        ? this.activePageIndex++
        : this.getRecommendation();
    }
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isRecommendationEachVisaNameData = false;
    this.selectedData = {};
  }

  getRecommendation() {
    this.isRecommendationQuestion = false; // if api is done, then have to remove
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isRecommendationEachVisaNameData = false;
    this.recommendationDataList = [];
    this.paramData.country_id = this.selectedData[2];
    this.paramData.nationality = this.selectedData[1];
    this.service.getVisaRecommendationsList(this.paramData).subscribe({
      next: (response) => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.isRecommendationEachVisaNameData = false;
        this.recomendationData = response;
        const uniqueVisaData = Array.from(
          new Set(this.recomendationData.map((item) => item.visa_name)) // Extract unique visa names
        ).map((visa_name) => {
          const visa = this.recomendationData.find(
            (item) => item.visa_name === visa_name
          );
          return { id: visa.id, visa_name, icon: visa.icon };
        });
        this.recommendationDataList = uniqueVisaData;
      },
      error: (error) => {
        this.isRecommendationData = false;
      },
    });
  }

  getVisaCategoryList(selectedData: any) {
    this.paramData.visa_type_id = selectedData.id;
    this.selectedVisaName = selectedData.visa_name;
    this.isRecommendationQuestion = false;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isRecommendationEachVisaNameData = true;
    this.eachVisaQuestionCategory = [];
    this.service
      .getGlobalworkvisaQuestionCategories(this.paramData)
      .subscribe((response) => {
        this.eachVisaQuestionCategory = response;
      });
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("work-visa");
  }

  viewOneQuestion(data: any) {
    this.isQuestionAnswerVisible = true;
    this.selectedQuestionData = data;
  }

  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }

  showSocialSharingList() {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    } else {
      socialShare.style.display =
        socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/global-work-visa/' +
      this.paramData.nationality + '/' + this.paramData?.country_id + '/' + this.paramData?.visa_type_id +
      '/' + this.paramData.category_id + '/' + this.selectedQuestionData?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/global-work-visa/' +
      this.paramData.nationality + '/' + this.paramData?.country_id + '/' + this.paramData?.visa_type_id +
      '/' + this.paramData.category_id + '/' + this.selectedQuestionData?.id);
    this.socialShareService.copyQuestion(textToCopy);
  }
  goBack() {
    if (this.isRecommendationData) {
      this.isRecommendationData = false;
      this.isRecommendationQuestion = true;
      this.activePageIndex = 0;
    } else if (this.isRecommendationEachVisaNameData) {
      this.isRecommendationEachVisaNameData = false;
      this.isRecommendationData = true;
      this.selectedVisaName = "";
    } else if (this.isRecommendationSavedData) {
      this.isRecommendationSavedData = false;
      this.selectedVisaCategory = "";
      if (this.paramData.question_id) {
        this.paramData.question_id = 0;
        this.isRecommendationQuestion = true;
        this.selectedVisaName = "";
      }
      else {
        this.isRecommendationEachVisaNameData = true;
      }
    } else {
      this.router.navigateByUrl("/pages/job-tool/career-tool");
    }
  }
  visaCategoryQuestionList: any[] = [];
  viewQuestions(category: any) {
    this.paramData.category_id = category.id;
    this.selectedVisaCategory = category?.category_name;
    this.service.getGlobalworkvisaQA(this.paramData).subscribe((response) => {
      this.visaCategoryQuestionList = response;
      this.isRecommendationQuestion = false;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = true;
      this.isRecommendationEachVisaNameData = false;
      if (this.paramData.question_id) {
        this.viewOneQuestion(this.visaCategoryQuestionList[0]);
        this.selectedVisaCategory = this.visaCategoryQuestionList[0].category_name;
        this.selectedVisaName = this.visaCategoryQuestionList[0].visa_name;
      }
    });
  }
  openReport() {
    let data: any = {
      isVisible: true,
      moduleId: 34,
    };
    this.dataService.openReportWindow(data);
  }
  goToHome(data: any) {
    this.isQuestionAnswerVisible = false;
  }
}
