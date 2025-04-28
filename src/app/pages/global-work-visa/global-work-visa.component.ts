import { Component, OnInit } from "@angular/core";
import { GlobalworkvisaService } from "../global-work-visa/global-work-visa.service";
import { Router, RouterModule } from "@angular/router";
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

  constructor(
    private service: GlobalworkvisaService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCountriesList();
    this.getVisaCountriesList();
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
  paramData = {
    country_id: 0,
    nationality: "",
    visa_type_id: 0,
    category_id: 0,
  };
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
    const socialMedias: { [key: string]: string } = {
      Whatsapp: "whatsapp://send?text=",
      Instagram: "https://www.instagram.com?url=",
      Facebook: "https://www.facebook.com/sharer/sharer.php?u=",
      LinkedIn: "https://www.linkedin.com/shareArticle?url=",
      Twitter: "https://twitter.com/intent/tweet?url=",
      Mail: "mailto:?body=",
    };
    const url = window.location.href + "/" + this.selectedQuestionData?.id;
    this.meta.updateTag({ property: "og:url", content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, "_blank");
  }

  copyLink() {
    const safeUrl = encodeURI(window.location.href);
    const selectedDegreeId = this.selectedQuestionData?.degree_id || "";
    const selectedQuestionId = this.selectedQuestionData?.id || "";
    const textToCopy = `${safeUrl}/${selectedDegreeId}/${selectedQuestionId}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Question Copied",
        });
      })
      .catch((err) => {
        this.toast.add({
          severity: "error",
          summary: "Warning",
          detail: "Failed to copy the question",
        });
        console.error("Failed to copy text: ", err);
      });
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
      this.isRecommendationEachVisaNameData = true;
      this.selectedVisaCategory = "";
    } else {
      this.router.navigateByUrl("/pages/job-tool/career-tool");
    }
  }
  visaCategoryQuestionList: any[] = [];
  viewQuestions(category: any) {
    this.paramData.category_id = category.id;
    this.selectedVisaCategory = category.category_name;
    this.service.getGlobalworkvisaQA(this.paramData).subscribe((response) => {
      this.visaCategoryQuestionList = response;
      this.isRecommendationQuestion = false;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = true;
      this.isRecommendationEachVisaNameData = false;
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
