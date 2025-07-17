import { Component, OnInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ListQuestion } from "src/app/@Models/question-list.model";
import { DataService } from "src/app/services/data.service";
import { ModuleServiceService } from "../module-store/module-service.service";
import { ReadQuestion } from "src/app/@Models/read-question.model";
import { RecentlyaddedquestionService } from "./recentlyaddedquestion.service";
import { Location } from "@angular/common";
import { ModuleListSub } from "../../@Models/module.model";
import { MenuItem } from "primeng/api";
import { DomSanitizer } from "@angular/platform-browser";
import { loadQuestionList } from "../module-store/module-store.actions";
import { LocationService } from "../../services/location.service";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CarouselModule } from "primeng/carousel";
import { PaginatorModule } from "primeng/paginator";
import {StorageService} from "../../services/storage.service";
@Component({
  selector: "uni-recentlyaddedquestions",
  templateUrl: "./recentlyaddedquestions.component.html",
  styleUrls: ["./recentlyaddedquestions.component.scss"],
  standalone: true,
  imports: [ButtonModule, CommonModule, DialogModule, CarouselModule, PaginatorModule],
})
export class RecentlyaddedquestionsComponent implements OnInit {
  @ViewChild("carouselVideoElm") carouselVideoElm: any;
  @ViewChild("carouselRefElm") carouselRefElm: any;
  @ViewChild("carouselPopupVideoElm") carouselPopupVideoElm: any;
  @ViewChild("carouselPopupRefElm") carouselPopupRefElm: any;
  @ViewChild("videoLinksContainer") videoLinksContainer!: ElementRef;
  @ViewChild("refLinksContainer") refLinksContainer!: ElementRef;
  @ViewChild("videoFrame") videoFrame: ElementRef | undefined;

  subModules$!: Observable<ModuleListSub[]>;
  readQue$!: Observable<ReadQuestion[]>;
  //listQuestion$!: Observable<ListQuestion[]>;
  selectedQuestion: number = 0;
  selectedQuestionId: number = 0;
  selectedModule: number = 0;
  selectedSubModule: number = 0;
  selectedVideo: number = 0;
  selectedRefLink: number = 0;
  positionNumber: number = 0;
  data: any;
  type: any;
  breadCrumb: MenuItem[] = [];
  isQuestionAnswerVisible: boolean = false;
  isRecommendedLinksVisible: boolean = false;
  isRecommendedVideoVisible: boolean = false;
  isReviewedByVisible: boolean = false;
  isAnswerDialogVisiblePrev: boolean = false;
  isAnswerDialogVisibleNext: boolean = false;
  responsiveOptions: any[] = [];
  message: string = "";
  moduleName: any;
  subModuleId: any;
  videoLinks: any[] = [];
  refLink: any[] = [];
  countryId: any;
  selectedQuestionData: any;
  popUpItemVideoLink: any;
  reviewedByOrgList: any;
  currentSubModuleSlug: any;
  currentModuleName: any;
  currentModuleId: any;
  currentApiSlug: any;
  listQuestions: any;
  listQuestionCount: any;
  leftScrollButtonVisible: boolean = false;
  rightScrollButtonVisible: boolean = true;
  leftScrollButtonVisibleRef: boolean = false;
  rightScrollButtonVisibleRef: boolean = true;
  isSkeletonVisible: boolean = true;
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  constructor(private route: ActivatedRoute, private dataService: DataService,
              private moduleListService: ModuleServiceService, private service: RecentlyaddedquestionService,
              private _location: Location, private locationService: LocationService,
              private _sanitizer: DomSanitizer, private router: Router, private storage: StorageService) {}

  ngOnInit(): void {
    this.countryId = Number(this.storage.get("countryId"));
    this.route.params.subscribe((params) => {
      this.perpage = 50;
      this.pageno = 1;
      this.type = this.route.snapshot.paramMap.get("type");
      this.loadInit();
    });
    //this.getSubmoduleName(this.countryId);
  }

  loadInit(): void {
    this.subModuleId = this.route.snapshot.paramMap.get("id");
    this.currentSubModuleSlug = this.route.snapshot.paramMap.get("module_name");
    //this.getSubmoduleName(this.countryId);

    this.dataService.currentMessage.subscribe((message) => (this.message = message));
    this.breadCrumb = [
      {
        label: this.currentModuleName,
        command: (event) => this.gotomodulebreadcrump(),
      },
      { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
      { label: `Question ${this.selectedQuestion + 1}` },
    ];

    this.responsiveOptions = [
      {
        breakpoint: "1199px",
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: "991px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
    // this.listQuestion$ = this.moduleListService.questionList$();
    // let data = {
    //   countryId: Number(this.storage.get('countryId')),
    //   moduleId: this.currentModuleId,
    //   submoduleId: Number(this.subModuleId)
    // }
    // this.moduleListService.loadQuestionList(data);
    this.loadQuestionList();
  }

  loadQuestionList() {
    let req = {
      getcountry_id: this.countryId,
      perpage: this.perpage,
      page: this.pageno,
      popular: this.type == "popular" ? 1 : null,
    };
    let apiName = "getlatestfaqquestions";
    this.service.getRecentlyAddedQuestions(req, apiName).subscribe((response) => {
      this.isSkeletonVisible = false;
      this.listQuestions = response.latestaddedfaqquestions;
      this.listQuestionCount = response.count;
    });
  }

  goBack() {
    this._location.back();
  }

  getSubmoduleName(countryId: number) {
    let data = {
      countryId: countryId,
      api_module_name: this.currentApiSlug,
      moduleId: this.selectedModule,
    };

    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      data.modules.filter((res: any) => {
        if (res.id == this.selectedModule) {
          this.currentModuleName = res.module_name;
          this.breadCrumb = [
            {
              label: this.currentModuleName,
              command: (event) => this.gotomodulebreadcrump(),
            },
            { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
            { label: `Question ${this.selectedQuestion + 1}` },
          ];
        }
      });
    });
    this.moduleListService.loadSubModules(data);
    this.subModules$ = this.moduleListService.subModuleList$();
    this.subModules$.subscribe((event) => {
      if (event) {
        event.filter((data) => {
          if (data.submodule_id == this.selectedSubModule) {
            this.moduleName = data.submodule_name;
            this.breadCrumb = [
              {
                label: this.currentModuleName,
                command: (event) => this.gotomodulebreadcrump(),
              },
              { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
              { label: `Question ${this.selectedQuestion + 1}` },
            ];
          }
        });
      }
    });
  }

  convertToSlug(text: any) {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  onQuestionClick(selectedData: any) {
    // this.listQuestion$.subscribe(event => {
    //   this.data = event
    // })
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    let index = this.listQuestions.findIndex((x: any) => x.id === selectedData.id);
    this.selectedQuestion = index;
    this.positionNumber = index;
    this.getSubmoduleName(this.countryId);
    this.breadCrumb = [
      {
        label: this.currentModuleName,
        command: (event) => this.gotomodulebreadcrump(),
      },
      { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
      { label: `Question ${this.selectedQuestion + 1}` },
    ];

    this.isQuestionAnswerVisible = true;
    this.listQuestions.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId,
      moduleId: this.selectedModule,
      submoduleId: Number(this.selectedSubModule),
    };
    this.isAnswerDialogVisiblePrev = this.selectedQuestion >= 1;
    this.isAnswerDialogVisibleNext = this.selectedQuestion < this.listQuestions.length - 1;
    this.readQuestion(data);
  }

  readQuestion(data: any) {
    this.moduleListService.readQuestion(data);
    this.readQue$ = this.moduleListService.readQuestionMessage$();
    let data1 = {
      countryId: this.countryId,
      moduleId: this.selectedModule,
      submoduleId: Number(this.selectedSubModule),
    };
    //this.moduleListService.loadQuestionList(data1);
    //this.listQuestion$ = this.moduleListService.questionList$();
    this.loadQuestionList();
  }

  setPage(page: any) {
    let pageNum: number = 0;
    if (page.page < 0) {
      pageNum = this.listQuestions.length;
    } else {
      pageNum = page.page;
    }
    this.listQuestions.filter((res: any) => {
      if (res.id == pageNum + 1) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.positionNumber = pageNum + 1;
    this.breadCrumb = [
      {
        label: this.currentModuleName,
        command: (event) => this.gotomodulebreadcrump(),
      },
      { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
      { label: `Question ${pageNum + 1}` },
    ];
  }

  clickPrevious(carousel: any, event: any) {
    this.refLink = [];
    this.videoLinks = [];
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion <= 1) {
      this.isAnswerDialogVisiblePrev = false;
    }
    if (this.selectedQuestion <= 0) {
      return;
    }
    this.getSubmoduleName(this.countryId);
    let selectedData = this.listQuestions[this.selectedQuestion - 1];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    this.listQuestions.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navBackward(event, this.selectedQuestion);
    let data = {
      questionId: selectedData.id,
      moduleId: this.selectedModule,
      countryId: this.countryId,
      submoduleId: Number(this.selectedSubModule),
    };
    this.readQuestion(data);
  }

  clickNext(carousel: any, event: any) {
    this.refLink = [];
    this.videoLinks = [];
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion >= this.listQuestions.length - 2) {
      this.isAnswerDialogVisibleNext = false;
    }
    if (this.selectedQuestion >= this.listQuestions.length - 1) {
      return;
    }
    this.getSubmoduleName(this.countryId);
    let selectedData = this.listQuestions[this.selectedQuestion + 1];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion + 1;
    this.listQuestions.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navForward(event, this.selectedQuestion);
    let data = {
      questionId: selectedData.id,
      moduleId: this.selectedModule,
      countryId: this.countryId,
      submoduleId: Number(this.selectedSubModule),
    };
    this.readQuestion(data);
  }

  clickPreviousVideo(event: any) {
    if (this.selectedVideo <= 0) {
      return;
    }
    this.selectedVideo = this.selectedVideo - 1;
    this.carouselVideoElm.navBackward(event, this.selectedVideo);
  }

  clickNextVideo(event: any) {
    if (this.selectedVideo > this.videoLinks.length) {
      return;
    }
    this.selectedVideo += 1;

    this.carouselVideoElm.navForward(event, this.selectedVideo);
  }

  clickPreviousRef(event: any) {
    if (this.selectedRefLink <= 0) {
      return;
    }
    this.selectedRefLink = this.selectedRefLink - 1;

    this.carouselRefElm.navBackward(event, this.selectedRefLink);
  }

  clickNextRef(event: any) {
    if (this.selectedRefLink >= this.refLink.length / 2 - 1) {
      return;
    }
    this.selectedRefLink += 1;

    this.carouselRefElm.navForward(event, this.selectedRefLink);
  }

  onClickRecommendedVideo(data: any) {
    this.isRecommendedVideoVisible = true;
    let url = encodeURIComponent(data[0].link);
    this.popUpItemVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onClickRecommendedLinks(data: any) {
    this.isRecommendedLinksVisible = true;
  }

  onClickAsk() {
    this.router.navigateByUrl(`/pages/chat`);
    //this.dataService.changeChatOpenStatus("open chat window");
  }

  openReport() {
    let data = {
      isVisible: true,
      moduleId: this.selectedQuestionData.module_id,
      subModuleId: this.selectedQuestionData.submodule_id,
      questionId: this.selectedQuestionData.id,
      from: "module",
    };
    this.dataService.openReportWindow(data);
  }

  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }

  goToHomebreadcrump() {
    this.isQuestionAnswerVisible = false;
  }

  gotomodulebreadcrump() {
    if (this.currentModuleId == 1) {
      this.router.navigate(["/pages/modules/pre-admission"]);
    } else if (this.currentModuleId == 7) {
      this.router.navigate(["/pages/modules/travel-and-tourism"]);
    } else if (this.currentModuleId == 3) {
      this.router.navigate(["//pages/modules/post-admission"]);
    } else if (this.currentModuleId == 4) {
      this.router.navigate(["/pages/modules/career-hub"]);
    } else if (this.currentModuleId == 5) {
      this.router.navigate(["/pages/modules/university"]);
    } else if (this.currentModuleId == 6) {
      this.router.navigate(["/pages/modules/life-at-country"]);
    }
  }

  // popup video prev
  clickPreviousVideoPopup(data: any) {
    if (this.selectedVideo <= 0) {
      return;
    }
    this.selectedVideo = this.selectedVideo - 1;

    this.carouselPopupRefElm.navBackward(event, this.selectedVideo);
  }

  // popup video next
  clickNextVideoPopup(data: any) {
    if (this.selectedVideo >= this.videoLinks.length - 1) {
      return;
    }
    let vdoLinks = this.videoLinks.find((x: any) => x.id == this.selectedVideo);
    this.popUpItemVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(data[0].link);

    this.selectedVideo += 1;

    this.carouselPopupRefElm.navForward(event, this.selectedVideo);
  }

  clickPreviousRefPopup(data: any) {
    if (this.selectedRefLink <= 0) {
      return;
    }
    this.selectedRefLink = this.selectedRefLink - 1;

    this.carouselPopupRefElm.navBackward(event, this.selectedRefLink);
  }

  clickNextRefPopup(data: any) {
    if (this.selectedRefLink >= this.refLink.length - 1) {
      return;
    }
    this.selectedRefLink += 1;

    this.carouselPopupRefElm.navForward(event, this.selectedRefLink);
  }

  reviewBy() {
    this.reviewedByOrgList = [];
    this.isReviewedByVisible = true;
    let request = {
      question_id: this.selectedQuestionId,
    };
    // this.moduleStoreService.GetReviewedByOrgLogo(request).subscribe((response) => {
    //   this.reviewedByOrgList = response;
    // })
  }

  perpage: number = 10;
  pageno: number = 1;
  paginate(event: any) {
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    this.loadInit();
  }

  scrollRightVideo() {
    const container = this.videoLinksContainer.nativeElement;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    this.checkScrollPosition();
  }

  scrollLeftVideo() {
    const container = this.videoLinksContainer.nativeElement;
    const scrollAmount = -container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    this.checkScrollPosition();
  }

  scrollLeftRef() {
    const container = this.refLinksContainer.nativeElement;
    const scrollAmount = -container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    this.checkScrollPositionRef();
  }

  scrollRightRef() {
    const container = this.refLinksContainer.nativeElement;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    this.checkScrollPositionRef();
  }

  checkScrollPosition() {
    const container = this.videoLinksContainer.nativeElement;
    this.leftScrollButtonVisible = container.scrollLeft > 0;
    this.rightScrollButtonVisible = container.scrollWidth - container.clientWidth > container.scrollLeft;
  }

  checkScrollPositionRef() {
    const container = this.refLinksContainer.nativeElement;
    this.leftScrollButtonVisibleRef = container.scrollLeft > 0;
    this.rightScrollButtonVisibleRef = container.scrollWidth - container.clientWidth > container.scrollLeft;
  }
  // vedio pop-up code
  openNextPageLink: any;
  openVideoPopup(link: any): void {
    const sanitizedLink = this._sanitizer.bypassSecurityTrustResourceUrl(link);
    this.openNextPageLink = link;
    // Check if it's a YouTube video link
    if (this.isYoutubeVideoLink(link)) {
      // If it's a YouTube video link, extract the video ID and construct the embeddable URL
      const videoId = this.extractYoutubeVideoId(link);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.selectedVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      // If it's not a YouTube video link, use the URL directly
      this.selectedVideoLink = sanitizedLink;
    }

    this.showVideoPopup = true;
  }

  private isYoutubeVideoLink(link: string): boolean {
    // Check if the link is a YouTube video link based on a simple pattern
    return link.includes("youtube.com") || link.includes("youtu.be");
  }

  private extractYoutubeVideoId(url: string): string {
    const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : "";
  }

  @HostListener("document:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the Escape key (code 27)
    if (event.code === "Escape") {
      this.closeVideoPopup();
    }
  }
  closeVideoPopup(): void {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = "";
    }
    this.selectedVideoLink = null;
    this.showVideoPopup = false;
  }
  openNextVideo(): void {
    console.log("Opening next video:", this.openNextPageLink);
    if (this.openNextPageLink) {
      window.open(this.openNextPageLink);
    }
  }
  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }
}
