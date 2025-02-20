import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ContributorsService } from './contributors.service';
import { Contributiontier, Contributor, QuestionAnswer } from 'src/app/@Models/contributor.model';
import { LocationService } from 'src/app/location.service';
import { LocationData } from 'src/app/@Models/location.model';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uni-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, DropdownModule, ReactiveFormsModule],
  providers: [MessageService]
})
export class ContributorsComponent implements OnInit {

  title: string = "";
  isViewContributor: boolean = false;
  contributorList: Contributor[] = [];
  contributorQandAList: QuestionAnswer[] = [];
  contibutionTierList: Contributiontier[] = [];
  locationList: LocationData[] = [];
  isQuestionAnswerVisible: boolean = false;
  filterForm: FormGroup;
  loopRange = [0, 1, 2, 3, 4, 5, 6, 7];
  isSkeletonVisible: boolean = true;
  isQandAModal: boolean = false;
  selectedQuestionData: any;
  selectedContributor!: Contributor;

  constructor(
    private fb: FormBuilder,
    private contributorsService: ContributorsService,
    private locationService: LocationService,
    private toast: MessageService,
    private meta: Meta,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      contributiontier: [''],
      location: [''],
    });
    const contributorId = Number(this.route.snapshot.paramMap.get("id"));
    const questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    if (contributorId && questionId) {
      this.getContributionDetails(contributorId, questionId);
    }
    this.getContributorList({});
    this.getDropdownValues();
  }

  getContributorList(value: any) {
    this.contributorsService.getContributors(value).subscribe({
      next: res => {
        this.isSkeletonVisible = false;
        this.contributorList = res.data;
      },
      error: err => {
        this.isSkeletonVisible = false;
        console.log(err?.error?.message);
      }
    });
  }

  getDropdownValues() {
    this.contributorsService.getContributorDropDownList().subscribe({
      next: res => {
        this.contibutionTierList = res.contributiontier;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });

    this.locationService.getLocation().subscribe({
      next: res => {
        this.locationList = res;
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  getContributionDetails(id: number, questionId: number) {
    this.contributorsService.getContributionsDetails(id).subscribe({
      next: res => {
        this.viewContributor(res.data, questionId)
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  showFilter() {
    this.isQuestionAnswerVisible = true;
  }

  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.location && !formData.contributiontier) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.getContributorList(formData);
    this.isQuestionAnswerVisible = false;
  }

  resetFilter() {
    this.filterForm.reset();
    this.getContributorList({});
    this.isQuestionAnswerVisible = false;
  }

  viewContributor(data: Contributor, questionId?: number) {
    this.isViewContributor = true;
    this.title = data.name;
    this.selectedContributor = data;
    if (questionId) { // Question Share
      const selectedQues = this.selectedContributor?.question_answer[questionId - 1];
      this.viewOneQuestion(selectedQues, questionId - 1);
    }
  }

  viewOneQuestion(data: QuestionAnswer, index: number) {
    this.isQandAModal = true;
    this.selectedQuestionData = { ...data, id: index + 1 };
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
    const url = window.location.href + '/' + this.selectedContributor?.id + '/' + this.selectedQuestionData?.id;
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const safeUrl = encodeURI(window.location.href);
    const textToCopy = `${safeUrl}/${this.selectedContributor?.id}/${this.selectedQuestionData?.id}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
      })
      .catch((err) => {
        this.toast.add({ severity: "error", summary: "Warning", detail: 'Failed to copy the question' });
        console.error('Failed to copy text: ', err);
      });
  }

}
