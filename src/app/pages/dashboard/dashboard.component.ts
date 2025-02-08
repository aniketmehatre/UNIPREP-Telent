import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { AuthService } from "../../Auth/auth.service";
import { SubSink } from "subsink";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { combineLatest } from "rxjs";
import { Carousel } from "primeng/carousel";
import { LocationService } from "src/app/location.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CarouselModule } from "primeng/carousel";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { RouterModule } from "@angular/router";

@Component({
  selector: "uni-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [
    CommonModule, 
    DialogModule, 
    CarouselModule, 
    DropdownModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    RouterModule
  ],
  providers: [
    DashboardService,
    AuthService,
    DataService,
    LocationService
  ]
})
export class DashboardComponent implements OnInit, OnChanges {
  private subs = new SubSink();
  userName: any;
  responsiveOptions: any;
  selectedCountryName: any;
  readingProgressings: any;
  countryLists: any = [];
  quizProgressings: any = [];
  continueReading = "none";
  continueQuiz = "none";
  isVideoVisible: boolean = false;
  isShareWithSocialMedia: boolean = false;
  isViewMoreOrgVisible: boolean = false;
  partnerTrusterLogo: any;
  enableReading!: boolean;
  restrict: boolean = false;
  showSkeleton: boolean = false;
  planExpired: boolean = false;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  @ViewChild("carousel") carousel!: Carousel;
  university: any[] = [
    {
      image: "../../../uniprep-assets/images/icons/university1.svg",
    },
    {
      image: "../../../uniprep-assets/images/icons/university2.svg",
    },
    {
      image: "../../../uniprep-assets/images/icons/university3.svg",
    },
    {
      image: "../../../uniprep-assets/images/icons/university3.svg",
    },
    {
      image: "../../../uniprep-assets/images/icons/university3.svg",
    },
  ];
  selectedCountryId: number = 1;
  headerFlag!: string;
  currentModuleSlug: any;
  userData: any;
  constructor(private dashboardService: DashboardService, private service: AuthService, private router: Router, private dataService: DataService, private authService: AuthService, private locationService: LocationService) {
    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 5,
        numScroll: 5,
      },
      {
        breakpoint: "768px",
        numVisible: 4,
        numScroll: 4,
      },
      {
        breakpoint: "560px",
        numVisible: 2,
        numScroll: 2,
      },
    ];
  }

  fieldsToCheck = ["name", "email", "phone", "home_country_id", "selected_country", "location_id", "last_degree_passing_year", "intake_year_looking", "intake_month_looking", "programlevel_id"];

  ngOnInit(): void {
    this.locationService.getImage().subscribe((imageUrl) => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe((orgname) => {
      this.orgnamewhitlabel = orgname;
    });
    
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || 
        this.imagewhitlabeldomainname === "uniprep.ai" || 
        this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    
    this.checkplanExpire();
    this.selectedCountryId = Number(localStorage.getItem("countryId"));
    this.enableReadingData();
    
    localStorage.setItem("currentmodulenameforrecently", "");
    
    // Use combineLatest to handle multiple subscriptions efficiently
    this.subs.sink = combineLatest([
      this.dashboardService.getTrustedPartners(),
      this.dataService.countryFlagSource,
      this.service.getMe(),
      this.dataService.countryId
    ]).subscribe(([partnerLogo, flagData, userData, countryId]) => {
      // Handle partner logo
      this.partnerTrusterLogo = partnerLogo;
      
      // Handle flag data
      if (flagData !== "") {
        this.headerFlag = flagData;
      }
      
      // Handle user data
      if (userData) {
        this.userName = userData.userdetails[0].name.toString();
        this.userData = userData.userdetails[0];
        
        let filledCount = 0;
        const totalCount = this.fieldsToCheck.length;
        
        this.fieldsToCheck.forEach((field) => {
          if (this.userData[field] != null && 
              this.userData[field] !== undefined && 
              this.userData[field] !== "") {
            filledCount++;
          }
        });
        
        this.progress = Math.round((filledCount / totalCount) * 100);
        this.setProgress(Math.round((filledCount / totalCount) * 100));
      }
      
      // Handle country ID
      this.loadCountryList(countryId);
    });

    // Load API data separately as it doesn't depend on the above data
    this.loadApiData();
    this.checkquizquestionmodule();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCountryList(data: any) {
    this.locationService.dashboardLocationList().subscribe((countryList) => {
      this.carousel.page = 0;
      this.countryLists = countryList;
      this.countryLists.forEach((element: any) => {
        if (element.id == data) {
          this.selectedCountryName = element.country;
          this.selectedCountryId = element.id;
          this.headerFlag = element.flag;
        }
      });
      this.countryLists.forEach((item: any, i: any) => {
        if (item.id === this.selectedCountryId) {
          this.countryLists.splice(i, 1);
          this.countryLists.unshift(item);
        }
      });
    });
  }

  enableReadingData(): void {
    this.service.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.enableReading = false;
      } else {
        this.enableReading = true;
      }
    });
  }

  certificatecountstudent: number = 0;
  loadApiData(): void {
    const data = {
      countryId: this.selectedCountryId,
    };

    combineLatest(this.dashboardService.getReadProgression({ countryId: this.selectedCountryId })).subscribe(([readProgression]) => {
      if (readProgression) {
        if (!readProgression.success) {
          return;
        }
        //this.readProgressionPercentage = Math.round(readProgression.readpercentage);
        this.setProgress1(Math.round(readProgression.readpercentage));
        this.progressReading = Math.round(readProgression.readpercentage);
        this.certificatecountstudent = readProgression.certificatecount;
      }
    });
  }

  closeReading(): void {
    this.continueReading = "none";
  }

  openReading(): void {
    let data = {
      countryId: this.selectedCountryId,
    };

    this.dashboardService.getModuleReadProgression(data).subscribe((response) => {
      this.readingProgressings = response.module;
      this.continueReading = "block";
    });
  }

  closeQuiz(): void {
    this.continueQuiz = "none";
  }

  openQuiz(): void {
    // dont remove comments
    if (this.planExpired) {
      this.restrict = true;
      return;
    }

    this.router.navigate([`pages/modules/quizmodule`]);
  }

  selectCountry(selectedId: any): void {
    this.countryLists.forEach((element: any) => {
      if (element.id === selectedId.id) {
        this.selectedCountryName = element.country;
      }
    });
    this.countryLists.forEach((item: any, i: any) => {
      if (item.id === selectedId.id) {
        this.countryLists.splice(i, 1);
        this.countryLists.unshift(item);
      }
    });

    localStorage.setItem("countryId", selectedId.id);
    localStorage.setItem("selectedcountryId", selectedId.id);
    this.loadApiData();
    this.selectedCountryId = selectedId.id;
    this.dataService.changeCountryId(selectedId.id);
    this.dataService.changeCountryFlag(selectedId.flag);
    this.dataService.changeCountryName(selectedId.country);
  }

  onClickReadProgression(data: any): void {
    let moduleName = "";
    switch (data.module_id) {
      case 1:
        moduleName = "pre-admission";
        break;
      case 7:
        moduleName = "travel-and-tourism";
        break;
      case 3:
        moduleName = "post-admission";
        break;
      case 4:
        moduleName = "career-hub";
        break;
      case 5:
        moduleName = "university";
        break;
      case 6:
        moduleName = "life-at-country";
        break;
      case 10:
        moduleName = "skill-mastery";
        break;
      case 8:
        moduleName = "learning-hub";
        break;
      case 9:
        this.router.navigate([`pages/language-hub/`]);
        return;
        break;
      case 14:
        moduleName = "k12";
        break;
    }
    this.router.navigate([`pages/modules/${moduleName}/`]);
  }

  openCertificate() {
    this.router.navigate([`pages/mycertificate`]);
  }

  onClickQuizProgression(data: any): void {
    let moduleName = "";
    switch (data.module_name) {
      case "Pre-Admission":
        moduleName = "pre-admission";
        break;
      case "Post-Application":
        moduleName = "post-application";
        break;
      case "Post-Admission":
        moduleName = "post-admission";
        break;
      case "Career Hub":
        moduleName = "career-hub";
        break;
      case "University":
        moduleName = "university";
        break;
      case "Travel And Tourism":
        moduleName = "travel-and-tourism";
        break;
      case "Life at ":
        moduleName = "life-at";
        break;
      case "Skill Mastery":
        moduleName = "skill-mastery";
        break;
      case "Learning Hub":
        moduleName = "learning-hub";
        break;
      case "Language Hub":
        moduleName = "language-hub";
        break;
    }
    this.router.navigate([`pages/${moduleName}/sub-modules/2`]);
  }

  openViewMoreOrg(): void {
    this.isViewMoreOrgVisible = true;
  }
  quizpercentage: any = 0;
  checkquizquestionmodule() {
    var data = {
      countryid: this.selectedCountryId,
    };
    this.dashboardService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress;
    });
  }

  startQuiz(moduleid: any) {
    if (moduleid == 1) {
      this.currentModuleSlug = "pre-admission";
    } else if (moduleid == 3) {
      this.currentModuleSlug = "post-admission";
    } else if (moduleid == 4) {
      this.currentModuleSlug = "career-hub";
    } else if (moduleid == 6) {
      this.currentModuleSlug = "life-at-country";
    } else if (moduleid == 7) {
      this.currentModuleSlug = "travel-and-tourism";
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  openMyProfile() {
    this.router.navigate(["/pages/usermanagement"]);
  }

  @Input() progress: number = 0;
  @Input() progressReading: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["progress"]) {
      this.setProgress(this.progress);
    }
    if (changes["progressReading"]) {
      this.setProgress1(this.progressReading);
    }
  }

  setProgress(progress: number) {
    const circle = document.querySelector(".progress-ring__circle") as SVGCircleElement;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  }

  setProgress1(progress: number) {
    const circle = document.querySelector(".progress1-ring__circle") as SVGCircleElement;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${offset}`;
  }
}
