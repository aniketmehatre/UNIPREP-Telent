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
    // {
    //   title: "User Guide",
    //   url: "/pages/userguide",
    //   image: "fa-solid fa-book",
    // },
    {
      title: "Subscription",
      url: "/pages/subscriptions",
      image: "fa-solid fa-crown",
    },
    // {
    //   title: "Recommendations",
    //   url: "/pages/recommendations",
    //   image: "fa fa-star"
    // },
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
    },
    {
      title: "K12 Academic Tools",
      url: "/pages/modules/academic-tools",
      image: "fa-solid fa-scribble",
    },
    {
      title: "Job Board",
      url: "",
      image: "",
      subMenu: true
    },
    // {
    //   title: "Employer Connect",
    //   url: "/pages/talent-connect/list",
    //   image: "fa-solid fa-briefcase",
    // },
    {
      title: "Create Job Profile",
      url: "/pages/talent-connect/my-profile",
      image: "fa-solid fa-user",
    },
    {
      title: "Explore Jobs",
      url: "/pages/talent-connect/easy-apply",
      image: "fa-solid fa-user-tie-hair",
      mostPopular: true
    },
    {
      title: "Company Connect",
      url: "/pages/talent-connect/company-connect",
      image: "fa-solid fa-briefcase",
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
    // },
    {
      title: "Learning Hub",
      url: "/pages/modules/learning-hub",
      image: "fa-solid fa-road-circle-check",
    },
    {
      title: "Skill Mastery",
      url: "/pages/modules/skill-mastery",
      image: "fa-solid fa-swatchbook",
    },
    {
      title: "Career Tools",
      url: "/pages/job-tool/career-tool",
      image: "fa-solid fa-file-user",
      popular: true
    },
    // {
    //   title: "Career Planner",
    //   url: "/pages/career-planner",
    //   image: "fa-solid fa-arrow-progress",
    // },
    // {
    //   title: "Company List",
    //   url: "/pages/company-list",
    //   image: "fa-solid fa-buildings",
    // },
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
      popular: true
    },
    // {
    //   title: "Travel and Tourism",
    //   url: "/pages/modules/travel-and-tourism",
    //   image: "fa-solid fa-plane",
    // },
    // {
    //   title: "Life in",
    //   url: "/pages/modules/life-at-country",
    //   image: "fa-solid fa-earth-americas",
    // },
    {
      title: "Travel Tools",
      url: "/pages/travel-tools",
      image: "fa-solid fa-compass",
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
    },
    // {
    //   title: "Pre Admission",
    //   url: "/pages/modules/pre-admission",
    //   image: "fa-solid fa-file-import",
    // },
    // {
    //   title: "Post Application",
    //   url: "/pages/modules/post-application",
    //   image: "fa-solid fa-file-export",
    // },
    // {
    //   title: "Post Admission",
    //   url: "/pages/modules/post-admission",
    //   image: "fa-solid fa-ticket",
    // },
    // {
    //   title: "University",
    //   url: "/pages/modules/university",
    //   image: "fa-solid fa-building-columns",
    // },
    {
      title: "UNILEARN",
      url: "/pages/unilearn/modules",
      image: "fa-solid fa-ballot",
      popular: true
    },
    {
      title: "UNISCHOLAR",
      url: "/pages/scholarship-list",
      image: "fa-solid fa-diploma",
    },
    {
      title: "UNIFINDER",
      url: "/pages/course-list",
      image: "fa-solid fa-landmark-magnifying-glass",
      popular: true
    },
    {
      title: "Education Tools",
      url: "/pages/education-tools",
      image: "fa-solid fa-school",
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
    },
    {
      title: "Founders Tool",
      url: "/pages/founderstool/founderstoollist",
      image: "fa-solid fa-chart-network",
    },
    // {
    //   title: "Investor List",
    //   url: "/pages/investor-list",
    //   image: "fa-solid fa-chart-waterfall",
    // },
    {
      title: "Pitch Deck",
      url: "/pages/pitch-deck",
      image: "fa-solid fa-presentation-screen",
      popular: true
    },
    {
      title: "Others",
      url: "",
      image: "",
      subMenu: true
    },
    // {
    //   title: "Assessment",
    //   url: "/pages/assessment/ilearn-challenge",
    //   image: "fa-regular fa-badge-check",
    // },
    {
      title: "AI Global Advisor",
      url: "/pages/advisor",
      image: "fa-solid fa-file-user",
    },
    // {
    //   title: "Resources",
    //   url: "/pages/resource",
    //   image: "fa-solid fa-link",
    // },
    {
      title: "Events",
      url: "/pages/events",
      image: "fa-solid fa-calendar-days",
    },
    // {
    //   title: "Quiz",
    //   url: "/pages/modules/quizmodule",
    //   image: "fa-solid fa-clock-desk",
    //   popular:true
    // },
    {
      title: "Certificates",
      url: "/pages/mycertificate",
      image: "fa-solid fa-file-certificate",
    },
    // {
    //   title: "Success Stories",
    //   url: "/pages/success-stories",
    //   image: "fa-solid fa-thumbs-up",
    // },
    {
      title: "Support",
      url: "",
      image: "",
      subMenu: true
    },
    {
      title: "Tutorials",
      url: "/pages/tutorials",
      image: "fa-solid fa-video",
    },
    // {
    //   title: "Contributors",
    //   url: "/pages/contributors",
    //   image: "fa-solid fa-hands-holding-dollar",
    // },
    {
      title: "FAQ",
      url: "/pages/faq",
      image: "fa-solid fa-comments-question",
    },
    {
      title: "24x7 Support",
      url: "/pages/support",
      image: "fa-solid fa-headset",
    },
    // {
    //   title: 'Help & Support',
    //   url: '/pages/help',
    //   image: 'fa-solid fa-phone-volume',
    // }
    // ,
    // {
    //   title: 'USER MANAGER',
    //   url: '/pages/usermanagement',
    //   image: 'pi pi-briefcase',
    // },
    // {
    //   title: 'SUBCRIPTION MANAGER',
    //   url: '/pages/subscriptionmanagement',
    //   image: 'pi pi-briefcase',
    // }
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
  premiumPlanMenus: string[] = ["Learning Hub", "Skill Mastery", "Career Tools", "Language Hub", "Travel Tools", "Global Repository",
    "UNILEARN", "UNISCHOLAR", "UNIFINDER", "Education Tools", "Startup Kit", "Founders Tool", "Pitch Deck",
    "AI Global Advisor", "Events", "Certificates"];

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
        },
      });
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
    this.updateMenuUrlBasedOnEmployerProfile();
    this.apiToCheckPartnerOrInstitute();
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
      const educationLevel = data?.education_level?.replace(/[\s\u00A0]/g, "").trim() || "HigherEducation";
      if (educationLevel === "K10") {
        this.menus = this.menus.filter((menu) => !this.k10RestrictedMenus?.includes(menu?.title));
      } else if (educationLevel === "HigherEducation") {
        this.menus = this.menus.filter((menu) => !this.HigherEduRestritedMenus?.includes(menu?.title));
      } else {
        this.menus = this.menus;
      }

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
    this.updateMenuUrlBasedOnSubscription();
  }

  updateMenuUrlBasedOnSubscription() {
    if (this.authService._user?.student_type_id == 2) {
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
      }
    }
  }

  updateMenuUrlBasedOnEmployerProfile() {
    const isProfileMissing = this.talentService._employerProfileData == null;
    const profileId = this.talentService._employerProfileData?.id;
    const menuMap: { [key: string]: string } = {
      "Create Job Profile": isProfileMissing ? "/pages/talent-connect/my-profile" : `/pages/talent-connect/my-profile/${profileId}`,
      "Explore Jobs": isProfileMissing ? "/pages/talent-connect/my-profile" : "/pages/talent-connect/easy-apply",
      "Company Connect": isProfileMissing ? "/pages/talent-connect/my-profile" : "/pages/talent-connect/company-connect",
    };
    this.menus.forEach((menu) => {
      if (menuMap[menu.title]) {
        menu.url = menuMap[menu.title];
        if (menu.title != 'Create Job Profile') {
          menu.sameUrl = isProfileMissing;
        }
      }
    });
  }

  changeSubscriptionUrl() {
    if (this.authService.user?.subscription) {
      const subscriptionItem = this.menus.find((item) => item.title === "Subscription");
      if (subscriptionItem) {
        subscriptionItem.url = "subscriptions/subscription-history";
      }
    }
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
}
