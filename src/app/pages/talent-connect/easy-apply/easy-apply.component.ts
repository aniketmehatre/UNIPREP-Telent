import { Component } from '@angular/core';
import {Paginator} from "primeng/paginator";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { Form, FormBuilder, FormGroup } from '@angular/forms';

interface JobListing {
  id: number;
  company: string;
  position: string;
  isVerified: boolean;
  matchedSkills: number;
  totalSkills: number;
  vacancies: number;
  location: string;
  startDate: string;
  companySize: string;
  workArrangement: string;
  employmentType: string;
  salaryRange: string;
  postedDate: string;
  total_applied: number;
  dueDate: string;
}

@Component({
  selector: 'uni-easy-apply',
  templateUrl: './easy-apply.component.html',
  styleUrls: ['./easy-apply.component.scss'],
  standalone: true,
  imports: [
    Dialog,
    Select,
    FormsModule,
    RouterLink

  ]
})
export class EasyApplyComponent {
  jobListings: any;
  industries: any[] = [];
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  totalJobs: number = 4;
  currencies: any[] = [
    { label: 'INR', value: 'INR' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' }
  ];
  displayModal: boolean = false;
  filterForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // Mock data - in a real app, this would come from a service
    this.jobListings = [
      {
        id: 1,
        company: 'UNIABROAD Pvt. Ltd.',
        position: 'Senior UI / UX Designer',
        isVerified: true,
        matchedSkills: 3,
        totalSkills: 4,
        location: 'Mysore, Karnataka',
        startDate: '19-02-2025',
        companySize: '0-50',
        workArrangement: 'Onsite',
        employmentType: 'Full Time',
        salaryRange: '50,000 - 1,00,000',
        postedDate: '19-02-2025',
        vacancies: 50,
        total_applied: 100,
        dueDate: '07-2-2025' 
      },
      {
        id: 2,
        company: 'UNIABROAD Pvt. Ltd.',
        position: 'Senior UI / UX Designer',
        isVerified: true,
        matchedSkills: 3,
        totalSkills: 4,
        location: 'Mysore, Karnataka',
        startDate: '19-02-2025',
        companySize: '0-50',
        workArrangement: 'Onsite',
        employmentType: 'Full Time',
        salaryRange: '50,000 - 1,00,000',
        postedDate: '19-02-2025',
        vacancies: 50,
        total_applied: 100,
        dueDate: '07-2-2025' 
      },
      {
        id: 3,
        company: 'UNIABROAD Pvt. Ltd.',
        position: 'Senior UI / UX Designer',
        isVerified: true,
        matchedSkills: 3,
        totalSkills: 4,
        location: 'Mysore, Karnataka',
        startDate: '19-02-2025',
        companySize: '0-50',
        workArrangement: 'Onsite',
        employmentType: 'Full Time',
        salaryRange: '50,000 - 1,00,000',
        postedDate: '19-02-2025',
        vacancies: 50,
        total_applied: 100,
        dueDate: '07-2-2025' 
      },
      {
        id: 4,
        company: 'UNIABROAD Pvt. Ltd.',
        position: 'Senior UI / UX Designer',
        isVerified: true,
        matchedSkills: 3,
        totalSkills: 4,
        location: 'Mysore, Karnataka',
        startDate: '19-02-2025',
        companySize: '0-50',
        workArrangement: 'Onsite',
        employmentType: 'Full Time',
        salaryRange: '50,000 - 1,00,000',
        postedDate: '19-02-2025',
        vacancies: 50,
        total_applied: 100,
        dueDate: '07-2-2025' 
      }
    ];
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      positionTitle: [''],
      industry: [null],
      workLocation: [null],
      workMode: [null],
      employmentType: [null],
      currency: ['INR'],
      salary: [''],
      experienceLevel: [null]
    });
  }

  show(): void {
    this.displayModal = true;
  }

  applyFilter(): void {
    // Implement filter logic
    console.log('Applying filters');
    this.displayModal = false;
  }

  resetFilter(): void {
    // Reset all filters
    console.log('Resetting filters');
    // Logic to clear all selections
  }

  openVideoPopup(id: string) {}
}
