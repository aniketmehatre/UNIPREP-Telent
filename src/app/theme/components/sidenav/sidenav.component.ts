import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { error } from "console";
import { filter } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/Auth/auth.service";
import { DataService } from "src/app/data.service";
import { LocationService } from "src/app/location.service";

export interface SideMenu {
  title: string;
  image: string;
  url: string;
  description: string;
  expanded?: boolean;
  header?: boolean;
  children?: SideMenu[];
  active?: boolean;
}

@Component({
  selector: "uni-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent {
  @ContentChild("appTitle") appTitle!: TemplateRef<any>;
  @Output() active = new EventEmitter<SideMenu>();
  @Input() isOverlap = false;
  @Input() menus: SideMenu[] = [
    {
      title: "Dashboard",
      url: "/pages/dashboard",
      image: "fa-solid fa-objects-column",
      description: "" // Empty description
    },
    {
      title: "User Guide",
      url: "/pages/userguide",
      image: "fa-solid fa-book",
      description: "" // Empty description
    },
    {
      title: "Subscription",
      url: "/pages/subscriptions",
      image: "fa-solid fa-crown",
      description: "" // Empty description
    },
    {
      title: "Recommendations",
      url: "/pages/recommendations",
      image: "fa fa-star",
      description: "" // Empty description
    },
    {
      title: "Education",
      url: "",
      image: "",
      description: "" // Empty description
    },
    {
      title: "k12 Academy",
      url: "/pages/modules/k12",
      image: "fa-solid fa-people-group",
      description: "" // Empty description
    },
    {
      title: "Academic Tools",
      url: "/pages/modules/academic-tools",
      image: "fa-solid fa-scribble",
      description: "" // Empty description
    },
    {
      title: "Pre Admission",
      url: "/pages/modules/pre-admission",
      image: "fa-solid fa-file-import",
      description: "" // Empty description
    },
    {
      title: "Post Admission",
      url: "/pages/modules/post-admission",
      image: "fa-solid fa-ticket",
      description: "" // Empty description
    },
    {
      title: "University",
      url: "/pages/modules/university",
      image: "fa-solid fa-building-columns",
      description: "" // Empty description
    },
    {
      title: "UNIFINDER",
      url: "/pages/course-list",
      image: "fa-solid fa-landmark-magnifying-glass",
      description: "" // Empty description
    },
    {
      title: 'UNISCHOLAR',
      url: '/pages/scholarship-list',
      image: 'fa-solid fa-diploma',
      description: "" // Empty description
    },
    {
      title: "Career Hub",
      url: "/pages/modules/career-hub",
      image: "fa-solid fa-briefcase",
      description: "" // Empty description
    },
    {
      title: "UNILEARN",
      url: "/pages/unilearn/modules",
      image: "fa-solid fa-ballot",
      description: "" // Empty description
    },
    {
      title: "Language Hub",
      url: "/pages/language-hub",
      image: "fa-solid fa-books",
      description: "" // Empty description
    },
    {
      title: "Life",
      url: "",
      image: "",
      description: "" // Empty description
    },
    {
      title: "Life in",
      url: "/pages/modules/life-at-country",
      image: "fa-solid fa-earth-americas",
      description: "" // Empty description
    },
    {
      title: "Travel and Tourism",
      url: "/pages/modules/travel-and-tourism",
      image: "fa-solid fa-plane",
      description: "" // Empty description
    },
    {
      title: 'Career',
      url: '',
      image: '',
      description: "" // Empty description
    },
    {
      title: "Job Portal",
      url: "/pages/job-portal/job-search",
      image: "fa-solid fa-briefcase",
      description: "" // Empty description
    },
    {
      title: "Learning Hub",
      url: "/pages/modules/learning-hub",
      image: "fa-solid fa-road-circle-check",
      description: "" // Empty description
    },
    {
      title: "Skill Mastery",
      url: "/pages/modules/skill-mastery",
      image: "fa-solid fa-swatchbook",
      description: "" // Empty description
    },
    {
      title: "Career Tools",
      url: "/pages/job-tool/career-tool",
      image: "fa-solid fa-file-user",
      description: "" // Empty description
    },
    {
      title: "Entrepreneur",
      url: "",
      image: "",
      description: "" // Empty description
    },
    {
      title: "Startup Kit",
      url: "/pages/startup",
      image: "fa-solid fa-memo-circle-info",
      description: "" // Empty description
    },
    {
      title: "Founders Tool",
      url: "/pages/founderstool/founderstoollist",
      image: "fa-solid fa-chart-network",
      description: "" // Empty description
    },
    {
      title: "Pitch Deck",
      url: "/pages/pitch-deck",
      image: "fa-solid fa-presentation-screen",
      description: "" // Empty description
    },
    {
      title: "Others",
      url: "",
      image: "",
      description: "" // Empty description
    },
    {
      title: "Advisor",
      url: "/pages/advisor",
      image: "fa-solid fa-file-user",
      description: "" // Empty description
    },
    {
      title: "Resources",
      url: "/pages/resource",
      image: "fa-solid fa-link",
      description: "" // Empty description
    },
    {
      title: "Events",
      url: "/pages/events",
      image: "fa-solid fa-calendar-days",
      description: "" // Empty description
    },
    {
      title: "Quiz",
      url: "/pages/modules/quizmodule",
      image: "fa-solid fa-clock-desk",
      description: "" // Empty description
    },
    {
      title: "Certificates",
      url: "/pages/mycertificate",
      image: "fa-solid fa-file-certificate",
      description: "" // Empty description
    },
    {
      title: "Success Stories",
      url: "/pages/success-stories",
      image: "fa-solid fa-thumbs-up",
      description: "" // Empty description
    },
    {
      title: "Support",
      url: "",
      image: "",
      description: "" // Empty description
    },
    {
      title: "Tutorials",
      url: "/pages/tutorials",
      image: "fa-solid fa-video",
      description: "" // Empty description
    },
    {
      title: "FAQ",
      url: "/pages/faq",
      image: "fa-solid fa-comments-question",
      description: "" // Empty description
    },
    {
      title: "24x7 Support",
      url: "/pages/support",
      image: "fa-solid fa-headset",
      description: "" // Empty description
    }
  ];

  menuDesc: any = {
    "Recommendations": {
      "description":  "Get personalized suggestions based on your interests."
    },
      "K12 Academy": {
        "description": "Explore curriculum-focused content and resources for students in Grades 9 through 12."
      },
      "Academic": {
        "description": "Access a wide range of academic resources to enhance your learning and understanding."
      },
      "Pre Admission": {
        "description": "Prepare effectively for college with information on entrance requirements, application tips, and more."
      },
      "Post Admission": {
        "description": "Find guidance on navigating your new academic environment after securing admission."
      },
      "University": {
        "description": "Explore detailed profiles of universities worldwide, including programs, campus life, and application processes."
      },
      "UNIFINDER": {
        "description": "Search and apply to courses worldwide with our comprehensive global course finder."
      },
      "Career Hub": {
        "description": "Discover career opportunities and get resources to help you plan your professional path."
      },
      "UNILEARN": {
        "description": "Prepare for standardized tests and improve academic skills with practice tests and learning modules."
      },
      "Job Portal": {
        "description": "Connect with potential employers and browse job listings tailored to your skills and interests."
      },
      "Career Tools": {
        "description": "Enhance your employability with tools to create resumes, cover letters, and prepare for interviews."
      },
      "Cost of Living": {
        "description": "Compare the cost of living across different cities and countries to plan your financial needs."
      },
      "Global Salary Converter": {
        "description": "Convert and compare salaries globally to understand the value of potential job offers."
      },
      "Company List": {
        "description": "Access a curated list of companies by industry and location to target your job search effectively."
      },
      "Psychometric Test": {
        "description": "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile."
      },
      "Personality Test": {
        "description": "Discover more about your personality and how it aligns with various career paths."
      },
      "Employer Test": {
        "description": "Prepare for potential employer assessments with practice tests and study guides."
      },
      "Career Growth Checker": {
        "description": "Track your professional development and set goals with our career progression tool."
      },
      "Founders Tool": {
        "description": "Access resources for starting your business, from ideation to execution."
      },
      "Pitch Desk": {
        "description": "Create compelling pitch presentations to attract investors and partners."
      },
      "Quiz": {
        "description": "Test your knowledge across various subjects with quizzes to enhance learning and retention."
      },
      "Success Story": {
        "description": "Watch how UNIPREP has helped students achieve significant milestones in their journey."
      },
      "Tutorials": {
        "description": "Learn new skills and concepts through step-by-step tutorials in a variety of subjects."
      }
    }



  studentMenus = ['Company List', 'Career Planner', 'Learning Hub', 'Entrepreneur', 'Investor List', 'Startup Kit', 'Pitch Deck'];
  careerMenus = ['Entrepreneur', 'Investor List', 'Startup Kit', 'Pitch Deck'];
  whitlabelmenu=['Subscription','About UNIPREP','24x7 Support','Success Stories','Recommendations'];
  whitlabelmenuFreeTrails=['Subscription','About UNIPREP','24x7 Support','Success Stories'];
  collegeStudentMenus = ['Subscription'];
  conditionSubscribed!: boolean;
  currentTitle: any;
  visibleExhasted!: boolean;
  imagewhitlabeldomainname:any
  ehitlabelIsShow:boolean=true;
  orgnamewhitlabel:any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private locationService: LocationService,
  ) {
    this.dataService.countryNameSource.subscribe((countryName) => {
      this.menus.filter((data) => {
        if (data.title.includes("Life in"))
          data.title = "Life in " + countryName;
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
  enterpriseSubscriptionLink: any
  ngOnInit(): void {

    this.menus = this.menus.map(menu => {
      const description = this.menuDesc[menu.title]?.description || "";
      return {
        ...menu,
        description
      };
    });
    console.log(this.menus)
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.markCurrentMenu();
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;

      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.conditionSubscribed = false;
      } else {
        this.conditionSubscribed = true;
      }
      this.imagewhitlabeldomainname=window.location.hostname;
      if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
        this.ehitlabelIsShow=true;
      }else{
        if (res.subscription_details.subscription_plan === 'free_trail' && res.time_left.plan === 'on_progress') {
          this.menus = this.menus.filter(item => !this.whitlabelmenuFreeTrails.includes(item.title));
          this.ehitlabelIsShow=false;
        }else{
          this.menus = this.menus.filter(item => !this.whitlabelmenu.includes(item.title));
          this.ehitlabelIsShow=false; 
        }
      }
      if (res.subscription_details.subscription_plan == 'free_trail' && res.enterprise_subscription_link!= "") {
        this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
        if(res.enterprise_subscription_plan == 'Student'){
          this.menus = this.menus.filter(item => !this.studentMenus.includes(item.title));
        }else if(res.enterprise_subscription_plan == 'Career'){
          this.menus = this.menus.filter(item => !this.careerMenus.includes(item.title));
        }
      }
    });
    this.authService.getMe().subscribe(
      res => {

        if (res.userdetails[0].student_type_id == 2) {
          if (res.userdetails[0].subscription_plan == 'Student') {
            this.menus = this.menus.filter(item => !this.studentMenus.includes(item.title));
          }
          if (res.userdetails[0].subscription_plan == 'Career') {
            this.menus = this.menus.filter(item => !this.careerMenus.includes(item.title));
          }
          this.menus = this.menus.filter(item => !this.collegeStudentMenus.includes(item.title));
        }
      });

    //this.changeSubscriptionUrl();
  }

  changeSubscriptionUrl() {
    if (this.authService.user?.subscription) {
      const subscriptionItem = this.menus.find(
        (item) => item.title === "Subscription"
      );
      if (subscriptionItem) {
        subscriptionItem.url = "subscriptions/subscription-history";
      }
    }
  }

  markCurrentMenu() {
    const path = this.router.url.split("?")[0];
    const paramtersLen = Object.keys(
      this.activatedRoute.snapshot.params
    ).length;
    const pathArr = path
      .split("/")
      .slice(0, path.split("/").length - paramtersLen);
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

  listClick(event: any, newValue: any) {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      if (
        data.plan === "expired" &&
        newValue.title != "Dashboard" &&
        newValue.title != "Tutorials" &&
        newValue.title != "FAQ" &&
        newValue.title != "24x7 Support"
      ) {
        this.visibleExhasted = false;
      } else {
        this.visibleExhasted = false;
      }
    });
  }

  onClickSubscribedUser(): void {
    this.visibleExhasted = false;
    if(this.enterpriseSubscriptionLink !== ''){
      window.open(this.enterpriseSubscriptionLink, '_target');
      return;
    }
    this.router.navigate(["/pages/subscriptions"]);
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
      if(item.title == "Subscription"){
        if(this.enterpriseSubscriptionLink  != undefined){
          window.open(this.enterpriseSubscriptionLink, '_target');
          return;
        }
      }
      this.router.navigateByUrl(item.url || "/");
    }
  }

  closeQuiz(): void {
    this.visibleExhasted = false;
  }
}
