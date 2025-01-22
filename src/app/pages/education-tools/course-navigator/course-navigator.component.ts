import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-course-navigator',
  templateUrl: './course-navigator.component.html',
  styleUrls: ['./course-navigator.component.scss']
})
export class CourseNavigatorComponent implements OnInit {

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'Select your Specialization' },
    { id: 2, question: 'Choose Your Degree' }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  specializationList: { id: number, specialization_name: string }[] = [];
  specializations: { id: number, specialization_name: string }[] = [];
  DegreeList: { id: number, name: string }[] = [
    { id: 1, name: 'Bachelors' },
    { id: 2, name: 'Masters' },
    { id: 3, name: 'Diploma' },
  ];
  recommendationDataList: any[] = [
    { id: 1, title: 'BCA', image: 'uniprep-assets/images/founderstool/foundersacademy.svg' },
    { id: 2, title: 'BSC', image: 'uniprep-assets/images/founderstool/foundersacademy.svg' },
  ];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [
    { id: 1, question: 'What are the career opportunities after a Bsc in Computer Science?', read: 1 },
    { id: 2, question: 'What are the career opportunities after a Bsc in Matheatics?', read: 0 },
  ];
  isFromSavedData: boolean = false;
  isQuestionAnswerVisible: boolean = false;
  oneQuestionContent: any = {
    answer: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus dolorem nihil dolores dicta maiores. Ducimus, eos aperiam enim perspiciatis, impedit molestiae dolorum temporibus nam doloremque quo magni voluptatum quae at eum necessitatibus ipsa repellendus ullam repellat odio, iusto sunt. Dolore magni sapiente omnis, eos iste corrupti quas nobis, dolores quasi dignissimos cumque natus voluptatem debitis sit recusandae eum! Facilis corporis quibusdam, iusto labore dolores ex beatae incidunt accusamus dolorum harum cupiditate maxime blanditiis! Impedit ad iusto optio consectetur, saepe numquam et minus aspernatur dignissimos, pariatur deserunt dolorum? Atque, in suscipit ad, illum sequi magni, eligendi perferendis explicabo maxime voluptatibus quam. Nihil quos aliquam delectus? Nisi aliquid molestiae expedita odit perferendis est fuga illo repudiandae! Doloribus voluptatem aliquid sequi rem aut nisi nesciunt tenetur esse molestias corporis qui fuga inventore cumque assumenda quos nulla voluptates mollitia iste culpa, amet id voluptas animi. Vitae officiis at ut hic laborum ullam esse libero, aliquam temporibus quos doloremque dolorum quod nam assumenda reiciendis mollitia pariatur! Nobis iste ratione, itaque expedita enim, ut aut minus at error animi nesciunt nostrum aperiam dolore temporibus dolorum accusamus sequi eaque, quibusdam totam? Et, repudiandae libero sit labore numquam modi, nostrum ut sint nemo quos doloribus vitae dolores earum dolor itaque! Reprehenderit aliquam sint est at non? Non tenetur sit dolorem soluta saepe ducimus dolores reprehenderit mollitia omnis dignissimos inventore deleniti dolorum libero in, odit consequuntur? Ipsam modi nihil dolorem ullam quod labore alias recusandae consequuntur commodi, quam iusto totam dicta voluptatum eos quibusdam sapiente, dolores incidunt beatae? Dignissimos blanditiis expedita dolore deserunt non possimus magni aspernatur dolores doloremque. Exercitationem delectus perspiciatis est expedita, saepe et. Corporis, labore consectetur iure dolores assumenda inventore, aspernatur modi magnam incidunt saepe iusto sunt blanditiis quaerat repellat totam nihil esse recusandae ducimus similique nemo expedita obcaecati aliquam placeat? Maxime placeat commodi autem voluptas!'
  };
  selectedQuestionData: any;
  countryId: any;
  specializationFilter: string = '';

  constructor(
    private educationToolsService: EducationToolsService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,

  ) { }

  ngOnInit(): void {
    this.getCurrentSpecializations();
  }

  getCurrentSpecializations() {
    this.educationToolsService.getCurrentSpecializations().subscribe({
      next: response => {
        this.specializationList = response;
        this.specializations = response;
      },
      error: error => {
      }
    });
  }

  customFilterFunction() {
    if (this.specializationFilter === "") {
      this.specializationList = this.specializations;
      return;
    }
    this.specializationList = this.specializations.filter(item =>
      item?.specialization_name?.toLowerCase().includes(this.specializationFilter.toLowerCase())
    );
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

  getRecommendation() {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    // this.recommendationDataList = response.response;
    // let data: any = {
    //   current_specialization: this.selectedData[1],
    //   degree: this.selectedData[2]
    // }
    // this.educationToolsService.getEduRecommadations(data).subscribe({
    //   next: response => {
    //     this.isRecommendationQuestion = false;
    //     this.isRecommendationData = true;
    //     this.isRecommendationSavedData = false;
    //     this.recommendationDataList = response.response;
    //   },
    //   error: error => {
    //     this.isRecommendationData = false;
    //   }
    // });
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = false;
    this.selectedData = {};
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.isRecommendationQuestion = false;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = true;
      // this.educationToolsService.getEduSavedRecommadations('').subscribe({
      //   next: response => {
      //     this.isRecommendationQuestion = false;
      //     this.isRecommendationData = false;
      //     this.isRecommendationSavedData = true;
      //     this.recommadationSavedQuestionList = response.data;
      //   },
      //   error: error => {
      //   }
      // });
    }
  }

  showRecommandationData(data: any) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationDataList = data;
  }

  viewOneQuestion(data: any) {
    this.isQuestionAnswerVisible = true;
  }
  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }
  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
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
  shareViaWhatsapp() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(this.selectedQuestionData);
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink() {
    const textarea = document.createElement('textarea');

    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    const safeUrl = encodeURI(window.location.href);
    const selectedQuestionId = this.selectedQuestionData?.id || '';
    const safeCountryId = this.countryId || '';

    // Combine data with a safe format
    textarea.textContent = `${safeUrl}/${selectedQuestionId}`;

    // Append the textarea safely
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
  }
  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }
}