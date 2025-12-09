import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { InputGroupModule } from "primeng/inputgroup";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from "primeng/paginator";
import { ProgressBarModule } from "primeng/progressbar";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { TooltipModule } from "primeng/tooltip";
import {
  DropdownListData,
  worklocation,
  WorkLocations,
} from "src/app/@Models/talent-support.model";
import { DropdownDataService } from "src/app/services/dropdown-data.service";
import { TalentSupportService } from "src/app/services/talent-support.service";
import { WindowRefService } from "../subscription/window-ref.service";
import { environment } from "@env/environment";
import { ScrollTopModule } from "primeng/scrolltop";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: "app-talent-support",
  templateUrl: "./talent-support.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    InputNumberModule,
    ProgressBarModule,
    PaginatorModule,
    DialogModule,
    CarouselModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SelectModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    InputGroupModule,
    ConfirmPopupModule,
    ScrollTopModule,
    TableModule,
  ],
  providers: [ConfirmationService],
  styleUrls: ["./talent-support.component.scss"],
})
export class TalentSupportComponent implements OnInit {
  @ViewChild("jobTitleExp") jobTitleInput!: ElementRef<HTMLInputElement>;
  @Output() targetInput: EventEmitter<string> = new EventEmitter<string>();

  positions = [];
  currencies: any;
  employerDetails: any;
  workLocation: worklocation[];
  dropdownData: DropdownListData = {
    hiringtypes: [],
    institute_countries: [],
    institutes: [],
    positions: [],
    industrytypes: [],
    softskills: [],
    language: [],
    benifitandperks: [],
    compensationstructure: [],
    employmenttype: [],
    hiringstage: [],
    workmode: [],
    minimumeducation: [],
    currencycode: [],
    gender: [],
    experiecelevel: [],
    timeframe: [],
    interviewformat: [],
    proficiencylevel: [],
    departments: [],
  };

  priceMap: Record<string, number> = {
    Silver: 3999,
    Platinum: 6999,
    Diamond: 9999,
  };

  form = this.fb.group({
    requirements: this.fb.array([] as FormGroup[]),
  });
  totalAmount: string;
  minDate: Date;

  // PrimeNG dropdown options
  talentRequirementPlans = [];

  workMode = [];

  // Tooltip copy for Requirement Type info icon
  requirementTypeTooltip: string = `
      Choose the category you want to hire for.<br>
      • Intern – short-term, training-focused<br>
      • Freelancer – project-based, flexible hours<br>
      • Full-time – permanent role
      <br>• Part-time – limited weekly hours<br>
      • Volunteer – unpaid contribution
    `;
  supportView: boolean = false;
  page: number = 1;
  perPage: number = 10;
  employeesList: any[] = [];
  totalEmployeeCount: number = 0;
  selectedRequirement: any[] = [];
  showInfoDialog: boolean = false;
  currency: string = "";

  constructor(
    private fb: FormBuilder,
    private talentSupportService: TalentSupportService,
    private dropdownDataService: DropdownDataService,
    private toast: MessageService,
    private winRef: WindowRefService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.addRequirement();
  }

  ngOnInit() {
    let data = {};
    this.loadPositionTitleData(data);
    this.loadWorkLocationData();
    this.getUserDetails();
    this.getCurrencySumbol();
    this.dropdownDataService.getAll$().subscribe((d) => {
      this.dropdownData = d;
    });
    const today = new Date();
    this.minDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
    this.talentSupportService.talentSupportDropdownData().subscribe((res) => {
      this.talentRequirementPlans = res.data.talentRequirementPlans;
      this.workMode = res.data.workMode;
    });

    let previousRequirements: string = "";
    this.form.valueChanges.subscribe((val) => {
      const requirements = val?.requirements ?? [];
      const currentRequirements = JSON.stringify(
        requirements.map((req) => ({
          requirementType: req?.requirementType,
        }))
      );

      if (currentRequirements === previousRequirements) {
        return;
      }

      previousRequirements = currentRequirements;

      const hasValidRequirement = requirements.some((req) => {
        const reqType = req?.requirementType;

        return reqType != null && reqType !== "";
      });

      if (hasValidRequirement) {
        this.talentSupportAmount();
      }
    });

    this.authService.getMe().subscribe((res) => {
      this.employerDetails = res.userdetails[0].country_code;
    });
  }

  // UPDATED: Matches HTML structure and Validator requirements
  private buildRequirement(): FormGroup {
    return this.fb.group({
      requirementType: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      jobTitle: new FormControl<string | null>(null, [Validators.required]),
      currency: new FormControl<string | null>(null, [Validators.required]),
      // Changed from current_salary to min_salary to match HTML
      current_salary: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      // Optional max_salary for validation logic

      work_location: new FormControl<any>(null, [Validators.required]),

      // Changed from preferred_work_type to employment_type
      employment_type: new FormControl<any>(null, [Validators.required]),

      // Changed from preferred_work_mode to work_mode
      work_mode: new FormControl<string | null>(null, [Validators.required]),

      // Changed from comments to remarks
      remarks: new FormControl<string | null>(null),

      expanded: new FormControl<boolean>(true, { nonNullable: true }),
    });
  }

  get requirements(): FormArray<FormGroup> {
    return this.form.get("requirements") as FormArray<FormGroup>;
  }

  addRequirement(): void {
    const grp = this.buildRequirement();
    // recalc when this requirement changes
    grp.valueChanges.subscribe(() => this.recalculateTotal());
    this.requirements.push(grp);
    this.recalculateTotal();
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
      this.recalculateTotal();
    }
  }

  toggleExpand(index: number): void {
    const grp = this.requirements.at(index) as FormGroup;
    const current = grp.get("expanded")?.value as boolean;
    grp.get("expanded")?.setValue(!current);
  }

  // UPDATED: Uses 'requirementType'
  // onValueChange(event: any) {
  //   const selectedType = event.value;
  //   const price =
  //     selectedType && this.priceMap[selectedType]
  //       ? this.priceMap[selectedType]
  //       : 0;
  //   this.totalAmount = price;
  //   this.recalculateTotal();
  // }

  // UPDATED: Calculates total based on requirementType
  private recalculateTotal(): void {
    // let total = 0;
    // this.requirements.controls.forEach((grp) => {
    //   // Changed from 'talent_requirement_plan' to 'requirementType'
    //   const type = grp.get("requirementType")?.value as string | null;
    //   const profiles = 1;
    //   const price = type ? this.priceMap[type] ?? 0 : 0;
    //   total += profiles * price;
    // });
    // this.totalAmount = total;
  }

  postRequirement(): void {
    this.form.markAllAsTouched();
    let hasErrors = false;
    this.requirements.controls.forEach((grp, index) => {
      if (grp.invalid) {
        hasErrors = true;
        grp.get("expanded")?.setValue(true);
      }
    });

    if (hasErrors || this.form.invalid) {
      this.toast.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill in all required fields before submitting.",
      });
      return;
    }
    const formValue = this.form.value;

    // Map the requirements array to include calculated amounts
    if (formValue.requirements) {
      formValue.requirements = formValue.requirements.map(
        (requirement: any) => {
          const profiles = 1;
          // Ensure we use the new key 'requirementType'
          const requirementType = requirement.requirementType;
          const price =
            requirementType && this.priceMap[requirementType]
              ? this.priceMap[requirementType]
              : 0;
          const amount = profiles * price;

          // Ensure we use the new key 'employment_type'
          const employmentTypes = requirement.employment_type
            ? (Array.isArray(requirement.employment_type)
                ? requirement.employment_type
                : [requirement.employment_type]
              ).map(String)
            : null;

          return {
            ...requirement,
            // Ensure payload keys match what your backend expects or what your form provides
            employment_type: employmentTypes,
            amount: amount,
            pricePerProfile: price,
          };
        }
      );
    }

    // Add total amount to the form value
    const finalPayload = {
      ...formValue,
      totalAmount: this.totalAmount,
      currency: this.currency,
    };

    this.talentSupportService.talentSupportPayLink(finalPayload).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.payWithRazorPay(response.orderid);

          this.form.reset();
          // Re-add one empty requirement after reset
          this.requirements.clear();
          this.addRequirement();

          this.toast.add({
            severity: "success",
            summary: "Submitted",
            detail: "Our team will get back to you soon.",
          });
        }
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  isFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.requirements.at(index).get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  getFieldError(index: number, fieldName: string): string {
    const field = this.requirements.at(index).get(fieldName);
    if (field?.hasError("required")) {
      return "This field is required";
    }
    if (field?.hasError("min")) {
      return "Value must be at least 1";
    }
    return "";
  }

  loadPositionTitleData(data: any) {
    this.talentSupportService
      .getPositionTitleData(data)
      .subscribe((response) => {
        this.positions = response;
      });
  }

  loadWorkLocationData() {
    this.talentSupportService
      .getWorkLocationDropdownData()
      .subscribe((response: WorkLocations) => {
        this.workLocation = [...response.worklocations];
      });
  }

  payWithRazorPay(orderid: any) {
    let razorKey = "rzp_live_YErYQVqDIrZn1D";
    if (environment.domain == "api.uniprep.ai") {
      razorKey = "rzp_test_Crpr7YkjPaCLEr";
    }

    let phone = localStorage.getItem("phone"); // Added safe navigation
    const options: any = {
      key: razorKey,
      amount: this.totalAmount,
      currency: this.currency,
      name: "UNIPREP",
      description: "UNIPREP Subscription",
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
      order_id: orderid,

      prefill: {
        name: localStorage.getItem("Name"),
        email: localStorage.getItem("email"),
        contact: phone === null || phone === "" ? "9876543210" : phone,
      },
      notes: {
        address:
          "165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023 ",
      },
      modal: {
        escape: false,
      },
      theme: {
        color: "var(--p-primary-500)",
      },
    };

    options.handler = (response: any, error: any) => {
      options.response = response;
      var paymentdata = {
        razorpay_order_id: response?.razorpay_order_id,
        razorpay_payment_id: response?.razorpay_payment_id,
      };
      this.talentSupportService
        .talentSupportCompleteTransaction(paymentdata)
        .subscribe({
          next: (data: any) => {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: "You will receive invoice in mail",
            });
          },
          error: (err: any) => {
            console.log(err?.error?.message);
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: err?.error?.message,
            });
          },
        });
    };
    options.modal.ondismiss = () => {
      console.log("Transaction cancelled");
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Transaction cancelled",
      });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  getUserDetails() {
    // this.getUserDetailsService.getData().subscribe((response: any) => {
    //   if (response == null) {
    //     return;
    //   }
    //   this.employerDetails = response;
    // });
  }

  openGuideLines() {
    const guideLink = "https://shorturl.at/EPa6A";
    this.winRef.nativeWindow.open(guideLink, "_blank");
  }

  filteredValue: string = "";
  onDropdownFilter(event: any): void {
    this.filteredValue = event.filter;
    var data = {
      job: this.filteredValue,
    };
    this.loadPositionTitleData(data);
  }

  onFocusInput(fieldKey: string) {
    this.targetInput.emit(fieldKey);
  }

  resetMessageBox() {
    this.targetInput.emit("default");
  }

  confirmationPanel(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to add this custom title?",
      accept: () => {
        const title = this.jobTitleInput.nativeElement.value.trim();
        if (!title || title.length < 4) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Please enter at least 4 characters for the custom title",
          });
          return;
        }
        const customTitle = {
          position_title: title,
        };
        this.talentSupportService.createPositionTitle(customTitle).subscribe({
          next: (response: any) => {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: "Custom title added successfully",
            });
            var position = { job: response.title };
            this.loadPositionTitleData(position);

            // UPDATED: Use 'jobTitle' key
            const currentRequirement = this.requirements.at(0);
            currentRequirement.get("jobTitle")?.setValue(response.title);

            this.filteredValue = "";
          },
          error: (error: any) => {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to add custom title",
            });
          },
        });
      },
      reject: () => {
        event.preventDefault();
      },
    });
  }

  getCurrencySumbol() {
    this.talentSupportService.getStudentProfilesDropDownList().subscribe({
      next: (response) => {
        this.currencies = response.currencies;
      },
    });
  }

  // UPDATED: Validates using 'min_salary' and 'max_salary' keys
  private salaryRangeValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const minSalary = control.get("min_salary")?.value;
    const maxSalary = control.get("max_salary")?.value;

    if (minSalary && maxSalary && Number(minSalary) > Number(maxSalary)) {
      return { salaryRange: true };
    }

    return null;
  }

  openHiringOutput() {
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/1aCuxQLwx6T8b7ky8Jj_6jp2MF7ZCwgVITbSldE4XRBQ/edit?usp=sharing";

    // Open the link in a new tab
    this.winRef.nativeWindow.open(googleSheetsUrl, "_blank");

    this.toast.add({
      severity: "success",
      summary: "Opening Document",
      detail: "Hiring Output Sample is opening in a new tab",
    });
  }

  loadTalentSupport(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.talentSupportService
      .getTalentSupportHistory(data)
      .subscribe((response) => {
        this.employeesList = response.data.map((item: any) => ({
          ...item.transaction,
          requirements: item.requirements,
        }));
        this.totalEmployeeCount = response.total;
        this.supportView = true;
      });
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
  }

  openInfoDialog(employee: any) {
    this.selectedRequirement = employee.requirements ?? [];
    this.showInfoDialog = true;
  }

  prepareTalentSupportPayload() {
    const requirements = this.form.get("requirements")?.value ?? [];
    const country = (this.employerDetails || "").replace("+", "");
    const req = requirements.find((r) => r?.["requirementType"]);

    return req
      ? {
          plantype: req["requirementType"],
          country_code: country,
        }
      : {};
  }

  talentSupportAmount() {
    const payload = this.prepareTalentSupportPayload();
    this.talentSupportService
      .talentSupportCalculateAmount(payload)
      .subscribe((res: any) => {
        this.totalAmount = res.total_amount;
        this.currency = res.currency;
      });
  }
}
