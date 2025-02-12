import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContributorsService } from './contributors.service';
import { Contributiontier, Contributor, QuestionAnswer } from 'src/app/@Models/contributor.model';
import { LocationService } from 'src/app/location.service';
import { LocationData } from 'src/app/@Models/location.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss']
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

  constructor(
    private fb: FormBuilder,
    private contributorsService: ContributorsService,
    private locationService: LocationService,
    private toast: MessageService,
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      contributiontier: [''],
      location: [''],
    });
    this.getContributorList({});
    this.getDropdownValues();
  }

  getContributorList(value: any) {
    this.contributorsService.getContributors(value).subscribe({
      next: res => {
        this.contributorList = res.data;
      },
      error: err=>{
        console.log(err?.error?.message);
      }
    });
  }

  getDropdownValues(){
    this.contributorsService.getContributorDropDownList().subscribe({
      next: res => {
        this.contibutionTierList = res.contributiontier;
      },
      error: err=>{
        console.log(err?.error?.message);
      }
    });

    this.locationService.getLocation().subscribe({
      next: res => {
        this.locationList = res;
      },
      error: err=>{
        console.log(err?.error?.message);
      }
    });
  }

  
  viewSponsor(data: Contributor) {
    this.isViewContributor = true;
    this.title = data.name;
    this.contributorQandAList = data.question_answer;
  }

  viewOneQuestion() {

  }

  showFilter() {
    this.isQuestionAnswerVisible = true;
  }


  submitFilterForm() {
    const formData = this.filterForm.value;
    if (!formData.name && !formData.location && !formData.contributiontier && !formData.totalstudent) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.getContributorList(formData);
    this.isQuestionAnswerVisible = false;
  }

  resetFilter() {
    this.filterForm.reset();
    this.isQuestionAnswerVisible = false;
  }

  onShowModal(event: any) {

  }

  goBack() {

  }
}
