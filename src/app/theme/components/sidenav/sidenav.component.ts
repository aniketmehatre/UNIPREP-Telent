import { CommonModule } from "@angular/common";
import { Component, ContentChild, EventEmitter, Input, Output, signal, TemplateRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TieredMenuModule } from "primeng/tieredmenu";
import { filter } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/Auth/auth.service";
import { DataService } from "src/app/services/data.service";
import { LocationService } from "src/app/services/location.service";
import { AssessmentService } from "src/app/pages/assessment/assessment.service";
import { StorageService } from "src/app/services/storage.service";
import { TalentConnectService } from "src/app/pages/talent-connect/talent-connect.service";

export interface SideMenu {
  title: string;
  image: string;
  url: string;
  expanded?: boolean;
  header?: boolean;
  children?: SideMenu[];
  active?: boolean;
  restricted?: boolean;
  sameUrl?: boolean;
  popular?: boolean;
  mostPopular?: boolean;
  subMenu?: boolean;
  subMenuBy?: string;
  notInterested?: boolean;
}

@Component({
  selector: "uni-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  standalone: true,
  imports: [CommonModule, TieredMenuModule],
})
export class SidenavComponent {
  talentUrl: string;
  isPartner = signal(false)
  @ContentChild("appTitle") appTitle!: TemplateRef<any>;
  @Output() active = new EventEmitter<SideMenu>();
  @Input() isOverlap = false;

  @Input() menus: SideMenu[] = [
    {
      title: "Dashboard",
      url: "/pages/dashboard",
      image: "fa-solid fa-objects-column",
    },
    {
      title: "Academics",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "K12 Academy",
      url: "/pages/modules/k12",
      image: "fa-solid fa-people-group",
      subMenuBy: "Academics",
    },
    {
      title: "K12 Academic Tools",
      url: "/pages/modules/academic-tools",
      image: "fa-solid fa-scribble",
      subMenuBy: "Academics",
    },
    {
      title: "Job Board",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Create Job Profile",
      url: "/pages/talent-connect/my-profile",
      image: "fa-solid fa-user",
      subMenuBy: "Job Board",
    },
    {
      title: "Job Search",
      url: "/pages/talent-connect/easy-apply",
      image: "fa-solid fa-user-tie-hair",
      subMenuBy: "Job Board",
      mostPopular: true,

    },
    {
      title: "Job Tracker",
      url: "/pages/talent-connect/job-tracker",
      image: "fa-solid fas fa-briefcase",
      subMenuBy: "Job Board",
    },
    {
      title: "Company Search",
      url: "/pages/talent-connect/company-connect",
      image: "pi pi-building",
      subMenuBy: "Job Board",
    },
    {
      title: "Company Tracker",
      url: "/pages/talent-connect/company-tracker",
      image: "fas fa-folder",
      subMenuBy: "Job Board",
    },
    {
      title: "Career",
      url: "",
      image: "",
      subMenu: true
    },
    // {
    //   title: "Career Hub",
    //   url: "/pages/modules/career-hub",
    //   image: "fa-solid fa-briefcase",
    //   subMenuBy:"Career",
    // },
    {
      title: "Learning Hub",
      url: "/pages/modules/learning-hub",
      image: "fa-solid fa-road-circle-check",
      subMenuBy: "Career",
    },
    {
      title: "Skill Mastery",
      url: "/pages/modules/skill-mastery",
      image: "fa-solid fa-swatchbook",
      subMenuBy: "Career",
    },
    {
      title: "Career Tools",
      url: "/pages/job-tool/career-tool",
      image: "fa-solid fa-file-user",
      subMenuBy: "Career",
      popular: true
    },
    {
      title: "Entrepreneur",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Startup Kit",
      url: "/pages/startup",
      image: "fa-solid fa-memo-circle-info",
      subMenuBy: "Entrepreneur",
    },
    {
      title: "Founders Tool",
      url: "/pages/founderstool/founderstoollist",
      image: "fa-solid fa-chart-network",
      subMenuBy: "Entrepreneur",
    },
    {
      title: "Pitch Deck",
      url: "/pages/pitch-deck",
      image: "fa-solid fa-presentation-screen",
      subMenuBy: "Entrepreneur",
      popular: true
    },
    {
      title: "International Education",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Global Repository",
      url: "/pages/global-repo",
      image: "fa-solid fa fa-globe",
      subMenuBy: "International Education",
    },
    {
      title: "UNILEARN",
      url: "/pages/unilearn/modules",
      image: "fa-solid fa-ballot",
      subMenuBy: "International Education",
      popular: true
    },
    {
      title: "UNISCHOLAR",
      url: "/pages/scholarship-list",
      image: "fa-solid fa-diploma",
      subMenuBy: "International Education",
    },
    {
      title: "UNIFINDER",
      url: "/pages/course-list",
      image: "fa-solid fa-landmark-magnifying-glass",
      subMenuBy: "International Education",
      popular: true
    },
    {
      title: "Education Tools",
      url: "/pages/education-tools",
      image: "fa-solid fa-school",
      subMenuBy: "International Education",
    },
    {
      title: "Travel & Life",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Language Hub",
      url: "/pages/language-hub",
      image: "fa-solid fa-books",
      subMenuBy: "Travel & Life",
      popular: true
    },
    {
      title: "Travel Tools",
      url: "/pages/travel-tools",
      image: "fa-solid fa-compass",
      subMenuBy: "Travel & Life",
      popular: true
    },
    {
      title: "Others",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "AI Global Advisor",
      url: "/pages/advisor",
      image: "fa-solid fa-file-user",
      subMenuBy: "Others",
    },
    {
      title: "Events",
      url: "/pages/events",
      image: "fa-solid fa-calendar-days",
      subMenuBy: "Others",
    },
    {
      title: "Certificates",
      url: "/pages/mycertificate",
      image: "fa-solid fa-file-certificate",
      subMenuBy: "Others",
    },
    {
      title: "Support",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Subscription",
      url: "/pages/subscriptions",
      image: "fa-solid fa-crown",
    },
    {
      title: "Tutorials",
      url: "/pages/tutorials",
      image: "fa-solid fa-video",
      subMenuBy: "Support",
    },
    {
      title: "FAQ",
      url: "/pages/faq",
      image: "fa-solid fa-comments-question",
      subMenuBy: "Support",
    },
    {
      title: "24x7 Support",
      url: "/pages/support",
      image: "fa-solid fa-headset",
      subMenuBy: "Support",
    },
  ];

  k10RestrictedMenus: string[] = ["Career Tools", "Recommendations", "Career Hub", "Learning Hub", "Skill Mastery", "Startup Kit", "Founders Tool", "Pitch Deck", "Career", "Entrepreneur"];
  HigherEduRestritedMenus: string[] = ["K12 Academy", "K12 Academic Tools", "Academics"];
  whitlabelmenu = ["About UNIPREP", "24x7 Support", "Success Stories", "Recommendations"];
  whitlabelmenuFreeTrails = ["About UNIPREP", "24x7 Support", "Success Stories"];
  conditionSubscribed!: boolean;
  imageWhiteLabelDomainName: any;
  whiteLabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  collegeStudentRestrictedMenus = ["Assessment"];

  premiumPlanMenus: string[] = ["K12 Academy", "K12 Academic Tools", "Learning Hub", "Skill Mastery", "Career Tools", "Language Hub", "Travel Tools", "Global Repository",
    "UNILEARN", "UNISCHOLAR", "UNIFINDER", "Education Tools", "Startup Kit", "Founders Tool", "Pitch Deck", "24x7 Support",
    "AI Global Advisor", "Events", "Certificates"];
  interestMenuList: { id: number, name: string }[] = [
    { id: 1, name: 'Career' },
    { id: 2, name: 'Entrepreneur' },
    { id: 3, name: 'International Education' },
    { id: 4, name: 'Travel & Life' },
  ];
  originalMenus: SideMenu[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService,
    private authService: AuthService, private locationService: LocationService,
    private assessmentService: AssessmentService, private storage: StorageService,
    private talentService: TalentConnectService) {
    this.dataService.countryNameSource.subscribe((countryName) => {
      this.menus.filter((data) => {
        if (data.title.includes("Life in")) data.title = "Life in " + countryName;
      });
    });

    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe({
        next: () => {
          this.markCurrentMenu();
          if (this.talentService._employerProfileData && this.authService._user?.current_plan_detail?.current_plan == "Standard") {
            this.redirectToRestrictUrl('/pages/subscriptions');
          }
        },
      });
    this.talentService.employerProfileCompleted$.subscribe(data => {
      if (data) {
        this.updateMenuUrlBasedOnEmployerProfile(data);
      }
    })
  }

  get filteredMenus(): SideMenu[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.menus;
    } else {
      return this.menus.filter(menu =>
        !['Global Repository', 'UNISCHOLAR', 'UNIFINDER'].includes(menu.title)
      );
    }
  }

  enterpriseSubscriptionLink: any;
  ngOnInit(): void {
    this.apiToCheckPartnerOrInstitute();
    this.updateMenuUrlBasedOnAcademics();
    this.updateMenuUrlBasedOnEmployerProfile();
    let userTypeId = this.authService._user?.student_type_id == 2
    //  this condition for after refreshing also subscription menu need to hide for institute don't remove
    // if (this.authService._user?.student_type_id == 2) {
    //   this.menus = userTypeId
    //    ? this.menus.filter((menu: any) => menu.title !== 'Subscription')
    //    : this.menus;
    // }
    this.authService.userData.subscribe((data) => {
      // if (data?.student_type_id == 2) {
      //  this.menus = userTypeId
      //    ? this.menus.filter((menu: any) => menu.title !== 'Subscription')
      //   : this.menus;
      //this.menus = this.menus.filter((menu) => !this.collegeStudentRestrictedMenus?.includes(menu?.title));
      // }
    });
    let hostname = window.location.hostname;
    this.locationService.getSourceByDomain(hostname).subscribe((data: any) => {
      this.orgnamewhitlabel = data.name;
      this.imageWhiteLabelDomainName = data.source;
    })
    this.markCurrentMenu();
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res?.time_left;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.conditionSubscribed = false;
      } else {
        this.conditionSubscribed = true;
      }
      if (this.imageWhiteLabelDomainName === "Uniprep" || this.imageWhiteLabelDomainName === "Partner" || this.imageWhiteLabelDomainName === "uniprep.ai") {
        this.whiteLabelIsShow = true;
      } else {
        if (res?.subscription_details?.subscription_plan === "free_trail" && res?.time_left.plan === "on_progress") {
          this.menus = this.menus.filter((item) => !this.whitlabelmenuFreeTrails?.includes(item?.title));
          this.whiteLabelIsShow = false;
        } else {
          this.menus = this.menus.filter((item) => !this.whitlabelmenu?.includes(item?.title));
          this.whiteLabelIsShow = false;
        }
      }
    });
  }

  markCurrentMenu() {
    const path = this.router.url.split("?")[0];
    const paramtersLen = Object.keys(this.activatedRoute.snapshot.params).length;
    const pathArr = path.split("/").slice(0, path.split("/").length - paramtersLen);
    const url = pathArr.join("/");
    this.menus.forEach((menu) => {
      if (url.includes(menu.url || "**") && menu.url != "/") {
        menu.active = true;
        this.active.emit(menu);
      } else if (menu.url == url) {
        menu.active = true;
        this.active.emit(menu);
      } else {
        if (menu.children && menu.children?.length > 0) {
          menu.children.forEach((cmenu) => {
            if (url.includes(cmenu.url || "**")) {
              cmenu.active = true;
              menu.active = true;
              this.active.emit(cmenu);
            } else {
              cmenu.active = false;
              menu.active = false;
            }
          });
        } else {
          menu.active = false;
        }
      }
    });
  }

  listClick(event: any, data: SideMenu) {
    // event.stopPropagation();
  }

  onexpand(item: SideMenu) {
    if (item.header) {
      return;
    }
    if (item.expanded) {
      item.expanded = !item.expanded;
      return;
    }
    if (item.children) {
      if (item.children.length > 0) {
        item.expanded = true;
      } else {
        item.expanded = false;
      }
    } else {
      if (item.title == "Subscription") {
        if (this.enterpriseSubscriptionLink != undefined) {
          window.open(this.enterpriseSubscriptionLink, "_target");
          return;
        }
      }
      if (item.title == "Assessment") {
        this.assessmentService.sideMenuiLearnChallenge.next(true);
        return;
      }
      this.router.navigateByUrl(item.url || "/");
    }
  }

  // Step 1: To Check Domain
  apiToCheckPartnerOrInstitute() {
    this.locationService.getSourceByDomain(window.location.hostname).subscribe((response) => {
      if (response.source == 'Partner') {
        this.isPartner.set(true);
        this.menus = this.isPartner()
          ? this.menus.filter((menu: any) => menu.title !== 'UNIFINDER')
          : this.menus;
      }
    })
  }

  // Step 2: To Check Current Education
  updateMenuUrlBasedOnAcademics() {
    const educationLevel = this.authService._user?.education_level?.replace(/[\s\u00A0]/g, "").trim() || "HigherEducation";
    if (educationLevel === "K10") {
      this.menus = this.menus.filter((menu) => !this.k10RestrictedMenus?.includes(menu?.title));
    } else if (educationLevel === "HigherEducation") {
      this.menus = this.menus.filter((menu) => !this.HigherEduRestritedMenus?.includes(menu?.title));
    } else {
      this.menus = this.menus;
    }
  }

  // Step 3: To Check Employer Profile
  updateMenuUrlBasedOnEmployerProfile(data?: boolean) {
    const isProfileMissing = this.talentService._employerProfileData == null;
    const profileId = this.talentService._employerProfileData?.id;
    if (this.originalMenus.length == 0) {
      this.originalMenus = JSON.parse(JSON.stringify(this.menus));
    }
    if (isProfileMissing) {
      this.menus.forEach((item) => {
        if (item.title != 'Create Job Profile') {
          item.url = '/pages/talent-connect/my-profile';
          item.restricted = true;
        }
      });
      // this.redirectToRestrictUrl('/pages/talent-connect/my-profile');
    }
    else {
      if (data) {
        this.menus = this.originalMenus;
      }
      this.menus.forEach((item) => {
        if (item.title == 'Create Job Profile') {
          item.title = "My Job Profile";
          item.url = `/pages/talent-connect/my-profile/${profileId}`;
        }
      });
      this.updateMenuUrlBasedOnSubscription();
    }
    // const menuMap: { [key: string]: string } = {
    //   "Create Job Profile": isProfileMissing ? "/pages/talent-connect/my-profile" : `/pages/talent-connect/my-profile/${profileId}`,
    //   "Apply Jobs": isProfileMissing ? "/pages/talent-connect/my-profile" : "/pages/talent-connect/easy-apply",
    //   "Company Connect": isProfileMissing ? "/pages/talent-connect/my-profile" : "/pages/talent-connect/company-connect",
    // };
    // this.menus.forEach((menu) => {
    //   if (menuMap[menu.title]) {
    //     menu.url = menuMap[menu.title];
    //     if (menu.title != 'Create Job Profile') {
    //       menu.sameUrl = isProfileMissing;
    //     }
    //     else {
    //       if (!isProfileMissing) {
    //         menu.title = "My Job Profile"
    //       }
    //     }
    //   }
    // });
  }

  // Step 4: To Check Subscription
  updateMenuUrlBasedOnSubscription() {
    if (this.authService._user?.current_plan_detail?.current_plan == "Standard") {
      this.menus.forEach((item) => {
        if (this.premiumPlanMenus.includes(item.title)) {
          item.url = '/pages/subscriptions';
          item.restricted = true;
        }
        else {
          item.restricted = false;
        }
      });
      if (this.talentService._employerProfileData) {
        this.redirectToRestrictUrl('/pages/subscriptions');
      }
    }
    else {
      this.updateInterestMenus();
    }
  }
  // Step 5: To Check Interest Menu
  updateInterestMenus() {
    if (this.authService._user?.current_plan_detail?.current_plan == "Premium" &&
      this.authService._user?.current_plan_detail?.current_plan_status == "Paid" &&
      this.authService._user?.interest_type_ids?.length > 0) {
      if (this.authService._user?.interest_type_ids?.length == 4) {
        return; // if they selected all, then menu will be in the same order.There is no changes
      }
      const selectedTitles = this.interestMenuList
        .filter(item => this.authService._user?.interest_type_ids?.includes(item.id))
        .map(item => item.name);
      const notInterestedTitles = this.interestMenuList
        .filter(item => !this.authService._user?.interest_type_ids?.includes(item.id))
        .map(item => item.name);

      const selectedMenus = this.menus.filter(menu =>
        (menu.subMenu && selectedTitles.includes(menu.title)) ||
        (menu.subMenuBy && selectedTitles.includes(menu.subMenuBy))
      );
      const otherMenus: any = this.menus.filter(menu =>
        !((menu.subMenu && selectedTitles.includes(menu.title)) ||
          (menu.subMenuBy && selectedTitles.includes(menu.subMenuBy)))
      );

      const jobIndex = otherMenus.findLastIndex((item: any) => item?.subMenuBy == "Job Board");
      otherMenus.splice(jobIndex + 1, 0, ...selectedMenus);
      this.menus = otherMenus;
      this.menus.forEach(item => {
        if (notInterestedTitles.includes(item?.subMenuBy as string)) {
          item.notInterested = true;
        }
      });
    }
  }

  redirectToRestrictUrl(redirectUrl: string) {
    const restrictedMenuTitles = this.menus
      .filter(item => item.restricted)
      .map(item => item.title);
    const restrictedMenusUrl = this.originalMenus
      .filter(item => restrictedMenuTitles.includes(item.title))
      .map(item => item.url);
    const restrictedMenus = restrictedMenusUrl.flatMap(path => {
      const parts = path.split('/').filter(Boolean); // remove empty ""
      const cleanParts = parts.slice(1); // remove "pages"
      return cleanParts;
    });
    const isRestricted = restrictedMenus.some(segment => this.router.url.includes(segment));
    if (isRestricted) {
      this.router.navigateByUrl(redirectUrl);
    }
  }
}