import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Router } from '@angular/router';
import { Countries } from 'src/app/@Models/country.model';
import { BasicType } from 'src/app/@Models/recommandation-question.model';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-global-travel-visa',
  templateUrl: './global-travel-visa.component.html',
  styleUrls: ['./global-travel-visa.component.scss']
})
export class GlobalTravelVisaComponent implements OnInit {
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: "Select Your Nationality?" },
    { id: 2, question: "Select the country you are looking for?" },
    { id: 3, question: "Select your residential status of Country?" }
  ];
  residentStatus: { value: string, label: string }[] = [
    { value: "Resident", label: "Resident" },
    { value: "Non-Resident", label: "Non-Resident" }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  allCountries: Countries[] = [];
  invalidClass: boolean = false;
  title: string = "";
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationDataList: BasicType[] = [
    { id: 1, name: "Temporary Skill Shortage (TSS) Visa" },
    { id: 2, name: "Employer Nomination Scheme (ENS) Visa" },
    { id: 3, name: "Skilled Independent Visa" },
  ];
  visaCategoryList: any[] = [
    {
      id: 1,
      question: "What is the VISA Eligibility",
      answer: `Lorem ipsum dolor sit amet consectetur adipisicing elit.Consequatur harum neque deserunt reiciendis minus repellat tempora deleniti mollitia, in natus sint laudantium repellendus earum beatae nostrum dolorum illo dolorem culpa a. Eveniet perferendis aut quisquam? Ipsa illo minima inventore assumenda quibusdam voluptas eum iure, magnam consectetur omnis officiis, similique accusantium nobis natus vero nulla nostrum distinctio. Officiis porro dolore veniam ad a sint quia vel ipsam, aliquam repellendus repudiandae commodi odit, hic praesentium eius rem quo nobis animi doloremque dignissimos impedit! Nobis ratione quidem dolor tenetur quod, quae at? Vel amet esse suscipit quas iure, libero dolor adipisci eos exercitationem reiciendis earum? Veniam, at. Nesciunt eaque quas dolorem itaque beatae ratione sunt sapiente, placeat sint impedit et nostrum doloremque. Maiores, eveniet sed tempora quia accusantium qui maxime vero aperiam? Quo consectetur quod quidem. Aspernatur, sit officia! Vitae molestiae atque distinctio harum fugit, eaque minus, placeat ab excepturi voluptas impedit inventore dolore dolorem unde ipsum, corporis molestias laboriosam ipsam. Nulla rerum deserunt asperiores provident, distinctio ad nemo laborum, eveniet doloribus quis veniam itaque fugit autem quae alias minus magnam. Magni, pariatur error. Voluptatem, pariatur quis ipsa, corrupti praesentium animi maiores odit iure esse hic aliquam cum, perspiciatis ipsum architecto sunt repellat.`
    },
  ];
  isQuestionAnswerVisible: boolean = false;
  selectedQuestionData: any;

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,
  ) { }

  ngOnInit(): void {
    this.getCurrentModule();
    this.getCountriesList();
  }

  getCurrentModule() {
    let currentEndpoint = this.router.url.split('/').pop() || "";
    const titles: { [key: string]: string } = {
      "travel-visa": "Global Travel Visa",
      "global-work-visa": "Global Work Visa",
      "enterpreneur-visa": "Global Entrepreneur Visa",
      "study-visa": "Global Study Visa"
    };
    this.title = titles[currentEndpoint] || "";
  }

  getCountriesList() {
    this.travelToolService.getCountriesList().subscribe(response => {
      this.allCountries = response;
    });
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.invalidClass = !(itemId in this.selectedData);
    if (!this.invalidClass) {
      this.activePageIndex < this.recommendations.length - 1 ? this.activePageIndex++ : this.getRecommendation();
    }
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.selectedData = {};
  }

  getRecommendation() {
    this.isRecommendationQuestion = false; // if api is done, then have to remove
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;

    // let data = {
    //   source_id: this.selectedData[1],
    //   destination_id: this.selectedData[2]
    //   resident_id: this.selectedData[3]
    // }
    // this.travelToolService.getVisaRecommendations(data).subscribe({
    //   next: response => {
    //     this.isRecommendationQuestion = false;
    //     this.isRecommendationData = true;
    //     this.isRecommendationSavedData = false;
    //     this.recommendationDataList = response;
    //   },
    //   error: error => {
    //     this.isRecommendationData = false;
    //   }
    // });
  }

  getVisaCategoryList(visaId: number, questionId?: number) {
    this.isRecommendationQuestion = false; // if api is done, then have to remove
    this.isRecommendationData = false;
    this.isRecommendationSavedData = true;

    // this.travelToolService.getVisaCategoryList(visaId, questionId).subscribe({
    //   next: response => {
    //     this.isRecommendationQuestion = false;
    //     this.isRecommendationData = false;
    //     this.isRecommendationSavedData = true;
    //     this.visaCategoryList = response;
    //     if (questionId) {
    //       this.viewOneQuestion(this.visaCategoryList[0]);
    //     }
    //   },
    //   error: error => {
    //   }
    // });
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
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = {
      "Whatsapp": "whatsapp://send?text=",
      "Instagram": "https://www.instagram.com?url=",
      "Facebook": "https://www.facebook.com/sharer/sharer.php?u=",
      "LinkedIn": "https://www.linkedin.com/shareArticle?url=",
      "Twitter": "https://twitter.com/intent/tweet?url=",
      "Mail": "mailto:?body=",
    }
    const url = window.location.href + '/' + this.selectedQuestionData?.id;
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    const safeUrl = encodeURI(window.location.href);
    const selectedDegreeId = this.selectedQuestionData?.degree_id || '';
    const selectedQuestionId = this.selectedQuestionData?.id || '';
    const textToCopy = `${safeUrl}/${selectedDegreeId}/${selectedQuestionId}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
      })
      .catch((err) => {
        this.toast.add({ severity: "error", summary: "Warning", detail: 'Failed to copy the question' });
        console.error('Failed to copy text: ', err);
      });
  }

  goBack() {
    const urls: { [key: string]: string } = {
      "Global Travel Visa": "/pages/travel-tools",
      "Global Work Visa": "/pages/job-tool",
      "Global Entrepreneur Visa": "/pages/founderstool",
      "Global Study Visa": "/pages/education-tools"
    };
    const targetUrl = urls[this.title] || "";
    this.router.navigateByUrl(targetUrl);
  }
}
