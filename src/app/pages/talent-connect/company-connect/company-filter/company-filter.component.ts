import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TalentConnectService } from '../../talent-connect.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-company-filter',
  standalone: true,
  imports: [DialogModule, CommonModule, ReactiveFormsModule, SelectModule, MultiSelectModule, ButtonModule, InputTextModule],
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss']
})
export class CompanyFilterComponent implements OnInit, OnChanges {
  @Input() openModal: boolean = false;
  @Output() triggerApplyFiler: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetFilter: EventEmitter<any> = new EventEmitter<any>();
  @Input() isListView: boolean = true;
  industryTypes: any = [];
  globalPresence: any = [];
  locations: any = [];
  companySizes: any = [];
  foundedYears: any[] = [];
  companyForm: FormGroup = new FormGroup({});
  statusList = [
    { label: 'Following', value: 'Following' },
    { label: 'Sent', value: 'Sent' },
    { label: 'Recieved', value: 'Recieved' }
  ];
  constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder, private route: Router, private detectChanges: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.companyForm = this.fb.group({
      companyname: [],
      industrytype: [[]], // Array values
      companysize: [],
      hq: [],
      globalpresence: [[]], // Array values
      foundedyear: [],
      status:[]
    });
    this.setIsListViewFromRoute();
    this.loadFoundedYears();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      this.setIsListViewFromRoute();
      this.loadApiData();
    }

    if (changes['isListView'] && changes['isListView'].currentValue !== undefined) {
      this.isListView = changes['isListView'].currentValue;
      this.detectChanges.detectChanges();
    }
  }

  private setIsListViewFromRoute() {
    this.isListView = !this.route.url.includes('company-tracker');
  }

  loadApiData() {
    this.talentConnectService.getIndustryTypes().subscribe({
      next: (data) => {
        this.industryTypes = data;
      },
      error: (err) => {
        console.error('Error loading industry types:', err);
      }
    });

    this.talentConnectService.globalPresence().subscribe({
      next: (data) => {
        this.globalPresence = data;
      },
      error: (err) => {
        console.error('Error loading global presence data:', err);
      }
    });

    // If you want to enable this later
    this.talentConnectService.getCityWithFlag().subscribe({
      next: (data) => {
        this.locations = data;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
      }
    });

    this.talentConnectService.getCompanySizes().subscribe({
      next: (data) => {
        this.companySizes = data; // assuming it's nested like this
      },
      error: (err) => {
        console.error('Error loading company sizes:', err);
      }
    });
  }

  loadFoundedYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.foundedYears.push(year);
    }
  }

  triggerFilter() {
    this.openModal = false;
    this.triggerApplyFiler.emit(this.companyForm.value);
  }

  onResetFilter() {
    this.openModal = false;
    this.companyForm.reset();
    this.resetFilter.emit(this.companyForm.value);
  }
}
