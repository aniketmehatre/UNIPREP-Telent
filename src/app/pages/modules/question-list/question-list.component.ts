import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener, Renderer2, PipeTransform, Pipe,
} from "@angular/core";
import { Observable } from "rxjs";
import { ModuleListSub } from "../../../@Models/module.model";
import { ReadQuestion } from "../../../@Models/read-question.model";
import {
  ListQuestion,
  QuestionList,
} from "../../../@Models/question-list.model";
import { MenuItem } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { ModuleStoreService } from "../../module-store/module-store.service";
import { DataService } from "../../../data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Carousel } from "primeng/carousel";
import { AuthService } from "src/app/Auth/auth.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import { environment } from "@env/environment";
import { Console } from "console";

@Component({
  selector: "uni-question-list",
  templateUrl: "./question-list.component.html",
  styleUrls: ["./question-list.component.scss"],
})
export class QuestionListComponent implements OnInit {
  @ViewChild("carouselVideoElm") carouselVideoElm: any;
  @ViewChild("carouselRefElm") carouselRefElm: any;
  @ViewChild("carouselPopupVideoElm") carouselPopupVideoElm: any;
  @ViewChild("carouselPopupRefElm") carouselPopupRefElm: any;
  @ViewChild("videoLinksContainer") videoLinksContainer!: ElementRef;
  @ViewChild("refLinksContainer") refLinksContainer!: ElementRef;
  @ViewChild('videoFrame') videoFrame: ElementRef | undefined;
  readQue$!: Observable<ReadQuestion[]>;
  listQuestion$!: Observable<QuestionList>;
  questionCount$!: Observable<QuestionList[]>;
  selectedQuestion: number = 0;
  selectedQuestionId: number = 0;
  selectedModule: number = 0;
  selectedSubModule: number = 0;
  selectedVideo: number = 0;
  selectedRefLink: number = 0;
  positionNumber: number = 0;
  data: any;
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
  tooltip: any;
  questionListData: any[] = [];
  pageno: number = 1;
  perpage: number = 25;
  totalQuestionCount: any;
  oneQuestionContent: any;
  restrict: boolean = false;
  planExpired: boolean = false;
  isSkeletonVisible: boolean = true;
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  questionUrl:string="";
  allDataSet: any [] = [];
  @ViewChild('op', { static: false, read: ElementRef }) elRef: any;

  constructor(
    private moduleListService: ModuleServiceService,
    private mService: ModuleServiceService,
    private moduleStoreService: ModuleStoreService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private _location: Location,
    private _sanitizer: DomSanitizer,
    private router: Router, private ngxService: NgxUiLoaderService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    Carousel.prototype.changePageOnTouch = (e, diff) => { }
    Carousel.prototype.onTouchMove = () => { };
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   if (e.target !== this.elRef!.nativeElement) {
    //     let socialShare:any=document.getElementById("socialSharingList");
    //     if (socialShare) {
    //       socialShare.style.display = "none";
    //     }
    //     //this.showSocialSharingList();
    //   }
    // });
  }
  loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);
  ngOnInit(): void {

    //this.moduleListService.emptyQuestionList$();
    this.countryId = Number(localStorage.getItem('countryId'));
    this.route.params.subscribe((params) => {
      let socialShare:any=document.getElementById("socialSharingList");
      if (socialShare){
        socialShare.style.display = "none";
      }
      this.loadInit();
      //this.getSubmoduleName(this.countryId);
    });
    this.dataService.countryId.subscribe((data) => {
      // if(this.countryId != data){
      //   this.router.navigateByUrl(`/pages/modules/${this.currentSubModuleSlug}`);
      //   this.loadInit();
      // }
      localStorage.setItem('countryId', data);
      this.questionListData = [];
      this.isSkeletonVisible = true
      //this.loadInit();
    });
    // this.tooltip = "Questions related to the application process are answered";
    // this.questionUrl=environment.ApiUrl+this.router.url;
  }
  loadInit() {
    this.questionListData = [];
    this.countryId = Number(localStorage.getItem("countryId"));
    let countryName: any;
    this.subModuleId = this.route.snapshot.paramMap.get("id");
 
   if(this.subModuleId.includes("&&")) {
     let url = this.subModuleId.split("&&");
     localStorage.setItem('questionId', url[1]);
     this.subModuleId=url[0];
   }
    this.currentSubModuleSlug = this.route.snapshot.paramMap.get("module_name");
    this.dataService.countryName.subscribe((data) => {
      countryName = data;
    });
    this.checkplanExpire();
    switch (this.currentSubModuleSlug) {
      case "pre-admission":
        this.currentModuleId = 1;
        this.currentModuleName = "Pre-Admission";
        this.currentApiSlug = "getpreapplicationsubmoduleqcount";
        break;
      case "travel-and-tourism":
        this.currentModuleId = 7;
        this.currentModuleName = "Travel-and-Tourism";
        this.currentApiSlug = "getpostapplicationsubmoduleqcount";
        break;
      case "post-admission":
        this.currentModuleId = 3;
        this.currentModuleName = "Post-Admission";
        this.currentApiSlug = "getpostadmissionsubmoduleqcount";
        break;
      case "career-hub":
        this.currentModuleId = 4;
        this.currentModuleName = "Career Hub";
        this.currentApiSlug = "getcareerhubsubmoduleqcount";
        break;
      case "university":
        this.currentModuleId = 5;
        this.currentModuleName = "University";
        this.currentApiSlug = "getuniversitysubmoduleqcount";
        this.tooltip = "";
        break;
      default:
        this.currentModuleId = 6;
        this.currentModuleName = "Life At " + countryName;
        this.currentApiSlug = "getlifeincountrysubmoduleqcount";
        this.tooltip = "";
        break;
    }
    this.getSubmoduleName(this.countryId);

    this.dataService.currentMessage.subscribe(
      (message) => (this.message = message)
    );
    this.breadCrumb = [
      {
        label: this.currentModuleName,
        command: (event) => this.gotomodulebreadcrump(),
      },
      { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
      { label: "Question" },
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

    //this.listQuestion$ = this.moduleListService.questionList$();
    let data = {
      countryId: Number(localStorage.getItem("countryId")),
      moduleId: this.currentModuleId,
      submoduleId: Number(this.subModuleId),
      page: this.pageno,
      perpage: this.perpage,
    };
    this.loadQuestionList(data);
    //this.ngxService.start();
    //this.moduleListService.loadQuestionList(data);
    
  }
  loadQuestionList(data: any){

    this.mService.studentFullQuestionData(data).subscribe((res: any) => {
      this.allDataSet = res;

      // this.questionListData = data?.questions;
      // this.isSkeletonVisible = false
      // this.totalQuestionCount = data?.questioncount;
      //this.ngxService.stop();
      this.mService.studentsSubmoduleQuestions(data).subscribe((data: any) => {
        this.questionListData = data?.questions;
        this.isSkeletonVisible = false
        this.totalQuestionCount = data?.questioncount;
        //this.ngxService.stop();
        let questionData =  {id: localStorage.getItem('questionId') || ''};
        if(questionData.id) {
          this.viewOneQuestion(questionData);
          localStorage.removeItem('questionId');
        }
      });
    });
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }
  goBack() {
    this._location.back();
  }

  getSubmoduleName(countryId: number) {
    let data = {
      countryId: countryId,
      moduleId: this.currentModuleId,
    };
    //this.moduleListService.loadQuestionList()
    this.moduleStoreService.loadSubModuleData(data).subscribe((response) => {
      if (response) {
        response.filter((res: any) => {
          if (res.id == this.subModuleId) {
            this.moduleName = res.submodule_name;
          }
        });
      }
    });
    // this.subModules$ = this.moduleListService.subModuleList$();
    // this.subModules$.subscribe(event => {
    //   if(event){
    //     event.filter(data => {
    //       if (data.id == this.subModuleId) {
    //         this.moduleName = data.submodule_name;
    //       }
    //     })
    //   }
    // })
  }

  convertToSlug(text: any) {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  onQuestionClick(selectedData: any) {
    this.checkplanExpire();
     if(this.planExpired){
       this.restrict=true;
       return;
     }
    this.mService.questionList$().subscribe((data: any) => {
      this.data = data.questions;
    });
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    let index = this.data.findIndex((x: any) => x.id === selectedData.id);
    this.selectedQuestion = index;
    this.positionNumber = index;
    this.isQuestionAnswerVisible = true;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId,
      moduleId: this.currentModuleId,
      submoduleId: Number(this.subModuleId),
    };
    if (this.selectedQuestion < 1) {
      this.isAnswerDialogVisiblePrev = false;
    } else {
      this.isAnswerDialogVisiblePrev = true;
    }
    if (this.selectedQuestion >= this.data.length - 1) {
      this.isAnswerDialogVisibleNext = false;
    } else {
      this.isAnswerDialogVisibleNext = true;
    }
    this.breadCrumb = [
      {
        label: this.currentModuleName,
        command: (event) => this.gotomodulebreadcrump(),
      },
      { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
      { label: `Question ${index + 1}` },
    ];

    this.readQuestion(data);
  }

  readQuestion(data: any) {
    this.moduleListService.readQuestion(data);
    this.readQue$ = this.moduleListService.readQuestionMessage$();
    this.questionListData = this.questionListData.map((item) => {
      if (item.id === data.questionId) {
        return { ...item, read: 1 };
      }
      return item;
    });
  }

  setPage(page: any) {
    let pageNum: number = 0;
    if (page.page < 0) {
      pageNum = this.data.length;
    } else {
      pageNum = page.page;
    }
    this.data.filter((res: any) => {
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
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion <= 1) {
      this.isAnswerDialogVisiblePrev = false;
    }
    if (this.selectedQuestion <= 0) {
      return;
    }
    let selectedData = this.data[this.selectedQuestion - 1];
    let selectedDataReadAnswer = this.data[this.selectedQuestion];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navBackward(event, this.selectedQuestion);
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId,
      moduleId: this.currentModuleId,
      submoduleId: Number(this.subModuleId),
    };

    this.readQuestion(data);
  }

  clickNext(carousel: any, event: any) {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion >= this.data.length - 2) {
      this.isAnswerDialogVisibleNext = false;
    }
    if (this.selectedQuestion >= this.data.length - 1) {
      return;
    }
    let selectedData = this.data[this.selectedQuestion + 1];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion + 1;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navForward(event, this.selectedQuestion);
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId,
      moduleId: this.currentModuleId,
      submoduleId: Number(this.subModuleId),
    };
    this.readQuestion(data);
  }

  onClickRecommendedVideo(data: any) {
    this.isRecommendedVideoVisible = true;
    let url = encodeURIComponent(data[0].link);
    this.popUpItemVideoLink =
      this._sanitizer.bypassSecurityTrustResourceUrl(url);
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

  reviewBy() {
    this.reviewedByOrgList = [];
    this.isReviewedByVisible = true;
    let request = {
      question_id: this.selectedQuestionId,
    };
    this.moduleStoreService
      .GetReviewedByOrgLogo(request)
      .subscribe((response) => {
        this.reviewedByOrgList = response;
      });
  }

  paginatepost(event: any) {
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    let data = {
      countryId: Number(localStorage.getItem("countryId")),
      moduleId: this.currentModuleId,
      submoduleId: Number(this.subModuleId),
      page: this.pageno,
      perpage: this.perpage,
    };
    // this.moduleListService.loadQuestionList(data);
    // this.moduleListService.questionList$().subscribe((data: any) => {
    //   this.questionListData = data?.questions;
    //   this.totalQuestionCount = data?.questioncount;
    // });
    this.loadQuestionList(data);
  }

  viewOneQuestion(question:any){
    let questionData = this.allDataSet[question.id];
    if(question && question?.question) {
      questionData['question'] = question?.question;
    }
    else {
      let ques = this.questionListData.find((data: any) => data.id == question.id)
      questionData['question'] = ques?.question;
    }
    if(this.planExpired) {
      this.restrict=true;
      return;
    }
    this.oneQuestionContent = questionData
    this.isQuestionAnswerVisible = true
    this.getSubmoduleName(questionData.country_id)
    // this.breadCrumb = [
    //   {
    //     label: this.currentModuleName,
    //     command: (event) => this.gotomodulebreadcrump(),
    //   },
    //   { label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
    //   { label: 'Question' },
    // ];
     let data = {
       questionId: this.oneQuestionContent.id,
       countryId: this.oneQuestionContent.country_id,
       moduleId: this.currentModuleId,
       submoduleId: Number(this.subModuleId),
     };
     this.readQuestion(data);
    this.selectedQuestionData = questionData;
  }
  clearRestriction() {
    this.restrict = false;
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  showSocialSharingList(){
    let socialShare:any=document.getElementById("socialSharingList");
    if(socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }
  shareViaWhatsapp(){
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram(){
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook(){
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn(){
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter(){
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail(){
    const shareUrl = `mailto:?body=${encodeURIComponent(this.questionUrl)}`;
    window.open(shareUrl, '_blank');  
  }
  copyLink(){
    const textarea = document.createElement('textarea');
    textarea.textContent = window.location.href + '&&' + this.selectedQuestionData?.id;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
   // vedio pop-up code
   openNextPageLink:any;
   openVideoPopup(link: any): void {
     const sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
     this.openNextPageLink=link
     // Check if it's a YouTube video link
     if (this.isYoutubeVideoLink(link)) {
       // If it's a YouTube video link, extract the video ID and construct the embeddable URL
       const videoId = this.extractYoutubeVideoId(link);
       const embedUrl = `https://www.youtube.com/embed/${videoId}`;
       this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
     } else {
       // If it's not a YouTube video link, use the URL directly
       this.selectedVideoLink = sanitizedLink;
     }
 
     this.showVideoPopup = true;
   }
 
   private isYoutubeVideoLink(link: string): boolean {
     // Check if the link is a YouTube video link based on a simple pattern
     return link.includes('youtube.com') || link.includes('youtu.be');
   }
 
   private extractYoutubeVideoId(url: string): string {
     const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/;
     const match = url.match(videoIdRegex);
     return match ? match[1] : '';
   }
 
   @HostListener('document:keydown', ['$event'])
   onKeyDown(event: KeyboardEvent): void {
     // Check if the pressed key is the Escape key (code 27)
     if (event.code === 'Escape') {
       this.closeVideoPopup();
     }
   }
  closeVideoPopup(): void {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = '';
    }
    this.selectedVideoLink = null;
    this.showVideoPopup = false;
  }
   openNextVideo(): void {
    console.log('Opening next video:', this.openNextPageLink);
    if (this.openNextPageLink) {
      window.open(this.openNextPageLink);
    }
  }
   onShowModal(value : any) {
    let socialShare:any=document.getElementById("socialSharingList");
    socialShare.style.display = "none";
   }
 }
 @Pipe({ name: 'safe' })
 export class SafePipe implements PipeTransform {
   constructor(private sanitizer: DomSanitizer) { }
 
   transform(url: string): SafeResourceUrl {
     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }
 }