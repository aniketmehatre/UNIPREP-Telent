import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SubSink } from "subsink";
import { MessageService } from "primeng/api";
import { Carousel } from "primeng/carousel";
import { DialogModule } from "primeng/dialog";
import { CarouselModule } from "primeng/carousel";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { PopoverModule } from "primeng/popover";
import { TextareaModule } from "primeng/textarea";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { DashboardService } from "./dashboard.service";
import { AuthService } from "../../Auth/auth.service";
import { DataService } from "src/app/services/data.service";
import { LocationService } from "src/app/services/location.service";
import { TalentConnectService } from "../talent-connect/talent-connect.service";
import { LocalStorageService } from "ngx-localstorage";
import { FavouriteList, FeatureFavourite } from "./favourites-data";
import { ToastModule } from "primeng/toast";

const CHUNK_SIZE = 4;
const MIN_PROFILE_COMPLETION = 60;
const MAX_PROFILE_COMPLETION = 99;
const DEFAULT_REPORT_OPTION_ID = 21;
const FEEDBACK_POPUP_DURATION = 3000;
const DEFAULT_VIDEO_URL =
  "https://www.youtube.com/embed/5MSn3pbD11A?si=4mxp9G9rdbkBZDPH";

const PROFILE_FIELDS_TO_CHECK = [
  "name",
  "email",
  "phone",
  "home_country_id",
  "selected_country",
  "location_id",
  "last_degree_passing_year",
  "intake_year_looking",
  "intake_month_looking",
  "programlevel_id",
] as const;

const MODULE_ROUTE_MAP: { [key: number]: string } = {
  1: "pre-admission",
  7: "travel-and-tourism",
  3: "post-admission",
  4: "career-hub",
  5: "university",
  6: "life-at-country",
  10: "skill-mastery",
  8: "learning-hub",
  14: "k12",
};

const CAROUSEL_RESPONSIVE_OPTIONS = [
  { breakpoint: "1280px", numVisible: 4, numScroll: 4 },
  { breakpoint: "1024px", numVisible: 3, numScroll: 3 },
  { breakpoint: "768px", numVisible: 2, numScroll: 2 },
  { breakpoint: "560px", numVisible: 1, numScroll: 1 },
];

const CAROUSEL_RESPONSIVE_OPTIONS_2 = [
  { breakpoint: "1280px", numVisible: 4, numScroll: 4 },
  { breakpoint: "1024px", numVisible: 3, numScroll: 3 },
  { breakpoint: "768px", numVisible: 2, numScroll: 2 },
  { breakpoint: "560px", numVisible: 2, numScroll: 2 },
];

@Component({
  selector: "uni-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    CarouselModule,
    InputGroupAddonModule,
    InputGroupModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    RouterModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TableModule,
    AccordionModule,
    ReactiveFormsModule,
    PopoverModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [DashboardService, DataService, LocationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {
  private storage = inject(LocalStorageService);
  private subs = new SubSink();

  @ViewChild("op") op!: ElementRef<HTMLInputElement>;
  @ViewChild("carousel") carousel!: Carousel;
  @Input() progress: number = 0;

  userName: string = "";
  responsiveOptions = CAROUSEL_RESPONSIVE_OPTIONS;
  responsiveOptions1 = CAROUSEL_RESPONSIVE_OPTIONS_2;
  sendInvite: string = "";
  partnerTrusterLogo: any[] = [];
  groupedListFav: FeatureFavourite[][] = [];
  cvBuilderPercentage: number = 0;
  talentConnectPercentage: number = 0;
  totalPercentage: number = 0;
  isShowingCompletion: boolean = false;
  userData: any;
  recentJobApplication: any[] = [];
  isNoApplicationsData: boolean = true;
  reportOptionNgModel: number = DEFAULT_REPORT_OPTION_ID;
  reportSubmitForm!: FormGroup;
  featureList: FeatureFavourite[] = FavouriteList;
  userBasedVideo: string = "";
  reportOptionList: any[] = [
    {
      id: DEFAULT_REPORT_OPTION_ID,
      reportoption_name: "General Suggestions",
      status: 1,
      reporttype: 1,
      created_at: null,
      updated_at: null,
    },
  ];
  safeSrc!: SafeResourceUrl;
  viewAllJobAndCompanies: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private toaster: MessageService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private talentConnectService: TalentConnectService
  ) {
    this.reportSubmitForm = this.formBuilder.group({
      reportOption: [""],
      comment: [""],
    });
  }

  ngOnInit(): void {
    this.apiToCheckPartnerOrInstitute();
    this.groupedListFav = this.chunkArray(this.featureList, CHUNK_SIZE);
    this.recentJobs();
    this.recentCompanies();
    this.handleUserData();
  }

  private recentJobs(): void {
    this.subs.sink = this.dashboardService.RecentJobApplication().subscribe({
      next: (data: any) => {
        this.recentJobApplication = data.recent_jobs || [];
        this.isNoApplicationsData = this.recentJobApplication.length === 0;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isNoApplicationsData = true;
        this.cdr.detectChanges();
      },
    });
  }

  private recentCompanies(): void {
    this.subs.sink = this.dashboardService.RecentCompanies().subscribe({
      next: (data: any) => {
        this.partnerTrusterLogo = data.companies || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.partnerTrusterLogo = [];
        this.cdr.detectChanges();
      },
    });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  private handleUserData(): void {
    if (!this.authService._user) {
      return;
    }

    this.userName = this.authService._user.name?.toString() || "";
    this.userData = this.authService._user;

    const filledCount = PROFILE_FIELDS_TO_CHECK.filter((field) => {
      const value = this.userData[field];
      return value != null && value !== undefined && value !== "";
    }).length;

    const progress = Math.round(
      (filledCount / PROFILE_FIELDS_TO_CHECK.length) * 100
    );
    this.setProgress(progress);
  }

  private isPremiumUser(): boolean {
    return (
      this.authService._user?.current_plan_detail?.current_plan === "Premium"
    );
  }

  private isProfileCompleted(): boolean {
    const flag =
      this.talentConnectService._employerProfileData?.profile_completion_flag;
    return flag === 1 || (typeof flag === "number" && flag > 0);
  }

  private canAccessPremiumFeature(): boolean {
    return this.isProfileCompleted() && this.isPremiumUser();
  }

  openQuiz(): void {
    if (this.canAccessPremiumFeature()) {
      this.router.navigate(["pages/modules/quizmodule"]);
    }
  }

  openCertificate(): void {
    if (this.canAccessPremiumFeature()) {
      this.router.navigate(["pages/mycertificate"]);
    }
  }

  onClickReadProgression(data: any): void {
    if (data.module_id === 9) {
      this.router.navigate(["pages/language-hub/"]);
      return;
    }

    const moduleName = MODULE_ROUTE_MAP[data.module_id];
    if (moduleName) {
      this.router.navigate([`pages/modules/${moduleName}/`]);
    }
  }

  openViewMoreOrg(): void {
    if (this.isProfileCompleted()) {
      this.router.navigate(["/pages/talent-connect/company-connect"]);
    } else {
      this.viewAllJobAndCompanies = true;
    }
  }

  viewMoreOpenJobApplication(): void {
    if (this.isProfileCompleted()) {
      this.router.navigate(["/pages/talent-connect/easy-apply"]);
    } else {
      this.viewAllJobAndCompanies = true;
    }
  }

  openMyProfile(): void {
    this.router.navigate(["/pages/usermanagement"]);
  }

  selectFav(req: any): void {
    if (this.canAccessPremiumFeature()) {
      this.router.navigateByUrl(req.url);
    }
  }

  redirectToCvBuilder(): void {
    if (this.canAccessPremiumFeature()) {
      this.router.navigate(["/pages/job-tool/cv-builder"]);
    }
  }

  redirectToTalentConnect(): void {
    const profileId = this.talentConnectService._employerProfileData?.id;
    const route = profileId
      ? ["/pages/talent-connect/my-profile", profileId]
      : ["/pages/talent-connect/my-profile"];
    this.router.navigate(route);
  }

 sendInviteMail(): void {
  if (!this.sendInvite.trim()) {
    return;
  }

  this.subs.sink = this.dashboardService
    .sentEmailForInviteUniPrep({ email: this.sendInvite })
    .subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.toaster.add({
            severity: "success",
            summary: "Success",
            detail: response.message || "Invitation sent successfully",
          });
        } 
        else if (response.status === false) {
          console.log('Error case triggered - status is false');
          this.toaster.add({
            severity: "error",
            summary: "Error",
            detail: response.message || "Failed to send invitation",
          });
        }
        else {
          this.toaster.add({
            severity: "error",
            summary: "Error",
            detail: response.message || "Unexpected response",
          });
        }
        this.sendInvite = "";
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toaster.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.message || "Failed to send invitation",
        });
        this.sendInvite = "";
        this.cdr.detectChanges();
      },
    });
}

  private profileCompletion(): void {
    this.subs.sink = this.dashboardService.profileCompletion().subscribe({
      next: (data: any) => {
        this.cvBuilderPercentage = data.cv_builder_completion || 0;
        this.talentConnectPercentage = data.talent_connect_completion || 0;
        this.totalPercentage = Math.floor(
          (this.cvBuilderPercentage +
            this.talentConnectPercentage +
            this.progress) /
          3
        );
        this.isShowingCompletion =
          this.totalPercentage >= MIN_PROFILE_COMPLETION &&
          this.totalPercentage <= MAX_PROFILE_COMPLETION;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  openReportModal(op: any, event: Event): void {
    op.toggle(event);
  }

  onSubmit(op: any): void {
    const data = {
      reportOption: this.reportSubmitForm.value.reportOption,
      comment: this.reportSubmitForm.value.comment,
    };

    this.subs.sink = this.locationService.reportFaqQuestion(data).subscribe({
      next: () => {
        this.reportSubmitForm.patchValue({ comment: "" });
        this.dataService.showFeedBackPopup(true);
        setTimeout(() => {
          this.dataService.showFeedBackPopup(false);
          op.hide();
        }, FEEDBACK_POPUP_DURATION);
      },
      error: () => {
        this.toaster.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to submit report",
        });
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["progress"]) {
      this.setProgress(this.progress);
    }
  }

  private setProgress(progress: number): void {
    this.progress = Math.max(0, Math.min(progress, 100));
    this.profileCompletion();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private apiToCheckPartnerOrInstitute(): void {
    this.subs.sink = this.locationService
      .getSourceByDomain(window.location.hostname)
      .subscribe({
        next: () => {
          this.userBasedVideo = DEFAULT_VIDEO_URL;
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.userBasedVideo
          );
          this.cdr.detectChanges();
        },
        error: () => {
          this.userBasedVideo = DEFAULT_VIDEO_URL;
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.userBasedVideo
          );
          this.cdr.detectChanges();
        },
      });
  }

  redirectEmployerProfile(): void {
    this.router.navigate(["/pages/talent-connect/my-profile"]);
  }

  linkRerouting(): void {
    if (this.isProfileCompleted()) {
      this.router.navigate(["/pages/talent-connect/easy-apply"]);
    } else {
      this.redirectEmployerProfile();
    }
  }
}
