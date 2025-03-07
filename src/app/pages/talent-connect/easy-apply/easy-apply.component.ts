import { Component } from '@angular/core';
import {Paginator} from "primeng/paginator";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

interface JobListing {
  id: number;
  company: string;
  position: string;
  isVerified: boolean;
  matchedSkills: number;
  totalSkills: number;
  location: string;
  startDate: string;
  companySize: string;
  workArrangement: string;
  employmentType: string;
  salaryRange: string;
  postedDate: string;
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
  jobListings: JobListing[] = [];
  totalJobs: number = 100;
  positionTitles: any[] = [];
  industries: any[] = [];
  workLocations: any[] = [];
  workTypes: any[] = [];
  employmentTypes: any[] = [];
  salaryRanges: any[] = [];
  experienceLevels: any[] = [];

  displayModal: boolean = false;
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
        postedDate: '19-02-2025'
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
        postedDate: '19-02-2025'
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
        postedDate: '19-02-2025'
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
        postedDate: '19-02-2025'
      }
    ];
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
