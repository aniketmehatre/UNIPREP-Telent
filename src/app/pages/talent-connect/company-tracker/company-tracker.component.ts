import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListsComponent } from './company-list/company-list.component';
import { RouterLink } from '@angular/router';
import { TalentConnectService } from "../talent-connect.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { forkJoin } from "rxjs";
import { PageFacadeService } from '../../page-facade.service';

interface DropdownOption {
  label: string;
  value: string;
}
@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CompanyListsComponent, CompanyDetailComponent, RouterLink]
})
export class CompanyTracker1Component {
  @Output() companyTrackerEmit: EventEmitter<number> = new EventEmitter();
  @Output() triggerApplyFilter: EventEmitter<any> = new EventEmitter();
  isSkeletonVisible: boolean = false;
  selectedJobId: number | null = null;
  displayModal: boolean = false;
  industryTypes: DropdownOption[] = [];
  companySizes: DropdownOption[] = [];
  locations: DropdownOption[] = [];
  globalPresence: DropdownOption[] = [];
  foundedYears: DropdownOption[] = [];
  companyTypes: DropdownOption[] = [];
  companyForm: FormGroup;
  studentIdForList: any
  companyData: any

  page: number = 1;
  perPage: number = 10;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];

  showChat: boolean = false;
  orgnamewhitlabel: string = '';

  constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder, private pageFacade: PageFacadeService) {
    this.companyForm = this.fb.group({
      companyname: [''],
      industrytype: [[]], // Array values
      companysize: [],
      hq: [],
      globalpresence: [[]], // Array values
      foundedyear: [],
      companytype: [],
    });
  }

  ngOnInit(): void {
  }


  toggleInfo(): void {
    this.showChat = !this.showChat;
  }

  onClickJobId(event: any) {
    this.companyData = event;
    this.showChat = false;
    this.selectedJobId = event.id;
  }


  upgradePlan() {

  }

  onDialogOpen() {
    this.loadApiData();
  }

  loadApiData() {
    forkJoin({
      companyTypes: this.talentConnectService.getCompanyTypes(),
      industryTypes: this.talentConnectService.getIndustryTypes(),
      globalPresence: this.talentConnectService.globalPresence(),
      locations: this.talentConnectService.getCityWithFlag(),
      companySizes: this.talentConnectService.getCompanySizes()
    }).subscribe({
      next: (results) => {
        this.companyTypes = results.companyTypes;
        this.industryTypes = results.industryTypes;
        this.globalPresence = results.globalPresence;
        this.locations = results.locations;
        this.companySizes = results.companySizes.industries; // Adjusting for industry structure
      },
      error: (error) => {
        console.error("Error loading data:", error);
      }
    });
  }

  applyFilter() {
    console.log(this.companyForm.value)
  }

  clearFilter() {

  }
  onStudentIdRelay(id: number) {
    this.studentIdForList = id;
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink)
  }
}
