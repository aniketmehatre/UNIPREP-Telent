import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TalentConnectService } from '../../talent-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-filter',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, SelectModule, MultiSelectModule, ButtonModule],
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss']
})
export class CompanyFilterComponent implements OnInit, OnChanges {
  @Input() openModal: boolean = false;
  @Output() triggerApplyFiler: EventEmitter<any> =  new EventEmitter<any>();
  @Output() closeFilter: EventEmitter<any> =  new EventEmitter<any>();
  @Output() resetFilter: EventEmitter<any> =  new EventEmitter<any>();
  @Input() isListView: boolean;
  companyTypes: any = [];
  industryTypes: any = [];
  globalPresence: any = [];
  locations: any = [];
  companySizes: any = []
  foundedYears: any[] = [];
  companyForm: FormGroup = new FormGroup({});
  constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder, private route: Router) {
  }

  ngOnInit() {
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

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['openModal']) {
        if(this.openModal) {
          this.route.url.includes('company-tracker') ? this.isListView = false : this.isListView = true;
          this.loadApiData();
        }
      }
    if (changes['isListView']) {
      this.isListView = changes['isListView'].currentValue;
    }
  }

  loadApiData() {
    this.talentConnectService.getCompanyTypes().subscribe({
      next: (data) => {
        this.companyTypes = data;
      },
      error: (err) => {
        console.error('Error loading company types:', err);
      }
    });
  
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
  

triggerFilter() {
  this.triggerApplyFiler.emit(this.companyForm.value);
}
}
