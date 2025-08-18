import { Component, Input, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AveragesalaryestimatorService } from "../../averagesalaryestimator/averagesalaryestimator.service";
import { PageFacadeService } from "../../page-facade.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JobOfferComparisionService } from "./joboffercomparison.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog"
import { DrawerModule  } from "primeng/drawer"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { RadioButtonModule } from "primeng/radiobutton"
import { PdfViewerModule } from "ng2-pdf-viewer";
import { JobOfferPreparedListComponent } from "./preparedlist/preparedlist.component";
@Component({
  selector: "uni-joboffercomparisontool",
  templateUrl: "./joboffercomparisontool.component.html",
  styleUrls: ["./joboffercomparisontool.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, DrawerModule , PdfViewerModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RadioButtonModule, JobOfferPreparedListComponent]
})

export class JoboffercomparisontoolComponent implements OnInit {
  basicInformationForm: FormGroup;
  salaryandemployeeBenefitsForm: FormGroup;
  worktimingsForm: FormGroup;
  additionalPerksForm: FormGroup;
  maxEntries = 3; // Maximum entries allowed
  preparedvisibility = false;
  constructor(
    private router: Router,
    private pageFacade: PageFacadeService,
    private avgestservice: AveragesalaryestimatorService,
    private service: JobOfferComparisionService,
    private fb: FormBuilder,
  ) {
    this.basicInformationForm = this.fb.group({
      basicInformation: this.fb.array([
        this.createBasicInfoGroup(),
        this.createBasicInfoGroup(),
      ]), // Initialize with 2 groups
    });
    this.salaryandemployeeBenefitsForm = this.fb.group({
      benefitsInformation: this.fb.array([]),
    });
    this.worktimingsForm = this.fb.group({
      worktimingsInformation: this.fb.array([]),
    });
    this.additionalPerksForm = this.fb.group({
      additionalPerksInformation: this.fb.array([]),
    });
  }
  //get basic information controls
  get basicInformation(): FormArray {
    return this.basicInformationForm.get("basicInformation") as FormArray;
  }

  // Create a new group for Basic Information with Validators
  createBasicInfoGroup(): FormGroup {
    return this.fb.group({
      companyName: ["", Validators.required], // Input field for Company Name
      position_title: [null, Validators.required], // Dropdown for Position
      location: [null, Validators.required], // Dropdown for Location
    });
  }
  // Add a new group to the array (if limit is not exceeded)
  addEntry(): void {
    if (this.basicInformation.length < this.maxEntries) {
      this.basicInformation.push(this.createBasicInfoGroup());
    }
  }

  // Remove a group from the array
  removeEntry(index: number): void {
    if (this.basicInformation.length > 2) {
      this.basicInformation.removeAt(index); // Allow removal only if more than 2 remain
    }
  }
  //create Benefits Information
  createBenfitInfoGroup(): FormGroup {
    return this.fb.group({
      currency: ["", Validators.required], // Input field for Company Name
      salary: [null, Validators.required], // Dropdown for salary
      benefits: [null, Validators.required], // Dropdown for benefits
    });
  }
  //get basic information controls
  get benefitsInformation(): FormArray {
    return this.salaryandemployeeBenefitsForm.get(
      "benefitsInformation"
    ) as FormArray;
  }
  //create worktimings Information
  createworktimingsGroup(): FormGroup {
    return this.fb.group({
      work_hours: ["", Validators.required], // Dropdown for workinghours
      working_days: [null, Validators.required], // Dropdown for workingdays
      employment_type: [null, Validators.required], // Dropdown for employmenttype
    });
  }
  //get worktimings controls
  get worktimingsInformation(): FormArray {
    return this.worktimingsForm.get("worktimingsInformation") as FormArray;
  }
  //create addtionalperks Information
  createadditionalPerksGroup(): FormGroup {
    return this.fb.group({
      workplacetypes: [null, Validators.required],
      perks: ["", Validators.required], // Dropdown for benefits
      travel_opportunities: [null, Validators.required], // Dropdown for opportunities
    });
  }
  //get additionalPerks controls
  get additionalPerksInformation(): FormArray {
    return this.additionalPerksForm.get(
      "additionalPerksInformation"
    ) as FormArray;
  }
  @Input() prepData: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  filterJobRole: any[] = [];

  recommendations: any = [
    {
      id: 1,
      question: "Basic Information",
    },
    {
      id: 2,
      question: "Salary & Employee Benefits",
    },
    {
      id: 3,
      question: "Work Timings",
    },
    {
      id: 4,
      question: "Additional Perks",
    },
  ];
  positions = [];
  currencies = [];
  locations = [];
  employeebenefits = [];
  traveloppurtunities = [];
  workbenefits = [];
  workhours = [];
  workingdays = [];
  //position dropdown
  getJobRoles() {
    this.avgestservice.getJobRoles().subscribe((response) => {
      this.positions = response;
    });
  }
  //location dropdown
  getCities() {
    this.avgestservice.getCities().subscribe((response) => {
      this.locations = response;
    });
  }
  //currency dropdown
  getCurrencyList() {
    this.avgestservice.getCurrencies().subscribe({
      next: (response) => {
        this.currencies = response;
      },
    });
  }
  //employeeBenefits dropdown
  getemployeeBenefits() {
    this.service.getemployeeBenefits().subscribe((response) => {
      this.employeebenefits = response;
    });
  }
  //travelOppertunities dropdown
  gettravelOppertunities() {
    this.service.gettravelOppertunities().subscribe((response) => {
      this.traveloppurtunities = response;
    });
  }
  //workBenefits dropdown
  getworkBenefits() {
    this.service.getworkBenefits().subscribe({
      next: (response) => {
        this.workbenefits = response;
      },
    });
  }
  //workHours dropdown
  getworkHours() {
    this.service.getworkHours().subscribe({
      next: (response) => {
        this.workhours = response;
      },
    });
  } //workingDays dropdown
  getworkingDays() {
    this.service.getworkingDays().subscribe({
      next: (response) => {
        this.workingdays = response;
      },
    });
  }
  //employement type
  jobPreferences: any = [];
  getJobPreferences() {
    this.avgestservice.getJobPreferences().subscribe((response) => {
      this.jobPreferences = response;
      console.log(this.jobPreferences, "job prefrences");
    });
  }
  //workplace type
  workplaceTypes: any = [];
  getworkplaceType() {
    this.service.getemploymentType().subscribe((response) => {
      this.workplaceTypes = response;
      console.log(this.workplaceTypes, "workplaceTypes");
    });
  }
  ngOnInit() {
    this.activePageIndex = 0;
    this.getJobRoles();
    this.getCities();
    this.getCurrencyList();
    this.getemployeeBenefits();
    this.gettravelOppertunities();
    this.getworkBenefits();
    this.getworkHours();
    this.getworkingDays();
    this.getJobPreferences();
    this.getworkplaceType();
  }
  previous(): void {
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(selectedId: number): void {
    if (selectedId == 1) {
      if (this.basicInformationForm.invalid) {
        this.basicInformationForm.markAllAsTouched();
        return;
      } else {
        this.benefitsInformation.clear();
        this.worktimingsInformation.clear();
        this.additionalPerksInformation.clear();

        this.basicInformation.value.forEach((infodetail: any) => {
          this.benefitsInformation.push(this.createBenfitInfoGroup());
          this.worktimingsInformation.push(this.createworktimingsGroup());
          this.additionalPerksInformation.push(this.createadditionalPerksGroup());
        });
        this.activePageIndex++;
      }
    }
    if (selectedId == 2) {
      if (this.benefitsInformation.invalid) {
        this.benefitsInformation.markAllAsTouched();
        return;
      } else {
        this.activePageIndex++;
      }
    }
    if (selectedId == 3) {
      if (this.worktimingsForm.invalid) {
        this.worktimingsForm.markAllAsTouched();
        return;
      } else {
        this.activePageIndex++;
      }
    }
    if (selectedId == 4) {
      if (this.additionalPerksForm.invalid) {
        this.additionalPerksForm.markAllAsTouched();
        return;
      } else {
        //get recommendation
        let processData = {
          jobs: this.constructJobsArray(),
        };
        this.prepData = processData;
        this.preparedvisibility = true;
      }
    }
  }
  constructJobsArray(): any[] {
    const jobs = [];
    for (let i = 0; i < this.basicInformation.length; i++) {
      const basicInfo = this.basicInformation.at(i).value;
      const benefitsInfo = this.benefitsInformation.at(i)?.value || {};
      const workTimingInfo = this.worktimingsInformation.at(i)?.value || {};
      const additionalPerksInfo =
        this.additionalPerksInformation.at(i)?.value || {};

      // Construct the job object
      const job = {
        company: basicInfo.companyName,
        position_title: basicInfo.position_title,
        location: basicInfo.location,
        currency: benefitsInfo.currency,
        benefits: benefitsInfo.benefits[0],
        salary: benefitsInfo.salary,
        perks: additionalPerksInfo.perks,
        workplacetypes: additionalPerksInfo.workplacetypes,
        working_days: workTimingInfo.working_days,
        work_hours: workTimingInfo.work_hours,
        employment_type: workTimingInfo.employment_type,
        travel_opportunities: additionalPerksInfo.travel_opportunities,
      };

      jobs.push(job);
    }

    return jobs;
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack() {
    if (this.preparedvisibility) {
      this.router.navigate(["/pages/job-offer-comparison"]);
    } else {
      this.router.navigate(["/pages/job-tool/career-tool"]);
    }
  }
  windowChange(data: any) {
    if (data == "error_arrived") {
      this.preparedvisibility = false;
    } else {
      this.preparedvisibility = data;
      this.activePageIndex = 0;
      this.basicInformationForm.reset();
      this.salaryandemployeeBenefitsForm.reset();
      this.worktimingsForm.reset();
      this.additionalPerksForm.reset();
    }
  }
}
