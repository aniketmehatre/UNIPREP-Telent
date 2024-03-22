import {
  Component,
  ElementRef, HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DashboardService } from "../dashboard/dashboard.service";
import { DataService } from "../../data.service";
import { MenuItem, MessageService } from "primeng/api";
import { LocationService } from "../../location.service";
import { SubSink } from "subsink";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from "rxjs";
import { ReadQuestion } from "../../@Models/read-question.model";
import { ModuleServiceService } from "../module-store/module-service.service";
import { ModuleStoreService } from "../module-store/module-store.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'uni-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: false, read: ElementRef }) elRef: any;
  @ViewChild('videoLinksContainer') videoLinksContainer !: ElementRef;
  @ViewChild('refLinksContainer') refLinksContainer !: ElementRef;
  @ViewChild('videoFrame') videoFrame: ElementRef | undefined;
  message: any
  countryName: any
  selectedGlobalData: any
  isSearchResultFound: boolean = false;
  isQuestionAnswerVisible: boolean = false;
  searchResult: any[] = [];
  searchKeywordTotalCount: number = 0;
  searchKeyword: any;
  breadCrumb: MenuItem[] = [];
  question: MenuItem[] = [];
  selectedQuestion: number = 0;
  responsiveOptions: any[] = [];
  data: any[] = [];
  moduleList: any;
  subModuleList: any;
  private subs = new SubSink();
  moduleName: any;
  subModuleName: any;
  searchInputValue: any;
  searchInputText: any;
  showCloseIcon: boolean = false;
  isAnswerDialogVisiblePrev: boolean = false;
  isAnswerDialogVisibleNext: boolean = false;
  videoLinks: any[] = [];
  refLink: any[] = [];
  selectedQuestionData: any;
  reviewedByOrgList: any;
  selectedQuestionId: number = 0;
  isReviewedByVisible: boolean = false;
  readQue$!: Observable<ReadQuestion[]>;
  @ViewChild('listgroup') listgroup: ElementRef | undefined;
  leftScrollButtonVisible: boolean = false;
  rightScrollButtonVisible: boolean = true;
  leftScrollButtonVisibleRef:boolean = false;
  rightScrollButtonVisibleRef:boolean = true;
  timeLeft: any;
  visibleExhastedData!: boolean;
  showVideoPopup: boolean = false;
  selectedVideoLink: any | null = null;
  constructor(private dashboardService: DashboardService, private dataService: DataService, private moduleStoreService: ModuleStoreService,
    private toastr: MessageService, private moduleListService: ModuleServiceService,    private sanitizer: DomSanitizer,
    private locationService: LocationService, private route: Router, private elementRef: ElementRef,
    private service:AuthService,
    private renderer: Renderer2) {
    this.dataService.chatTriggerSource.subscribe(message => {
      this.message = message;
    });
    this.dataService.countryNameSource.subscribe(countryName => {
      this.countryName = countryName;
    });
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.elRef!.nativeElement) {
        this.isSearchResultFound = false;
      }
    });
  }
  page: number = 1;

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event: any) {
    var insightsResults = document.getElementsByClassName(
        'scroller'
    )[0];
    var childInsights = insightsResults?.scrollHeight;
    var windowScroll = window.scrollY;
    if (Math.floor(windowScroll) >= Math.floor(childInsights)) {
      this.loadMore();
    }
  }

  onScrollingFinished() {
    console.log('load more');
  }


  loadMore(): void {
    this.page++;
  }
  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.enableReadingData();
  }

  onSearchChange(event: any) {
    this.searchKeyword = event;
    event == "" ? this.isSearchResultFound = false : '';
  }

  onKey(searchInput: any) {
    this.showCloseIcon = searchInput?.length > 0;
  }

  dataContentChange(test: any) {
    let searchValue = this.searchKeyword;
    const small = new RegExp(searchValue, "g");
    const caps = new RegExp(searchValue.toUpperCase(), "g");
    let newText = test.replace(small, '<span class="fw-bold uniprep-secondary" >' + searchValue + '</span>')
    return newText.replace(caps, '<span class="fw-bold uniprep-secondary">' + searchValue + '</span>');
  }

  searchKeyWord(searchInput: any) {
    if (searchInput.value == "") {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: "Enter keyword to search data." });
      return;
    }
    this.searchInputValue = searchInput.value;
    const data = {
      countryId: Number(localStorage.getItem('countryId')),
      searchtag: searchInput.value
    }
    this.dashboardService.searchKeyword(data).subscribe((res: any) => {
      if (res.success === false) {
        this.toastr.add({ severity: 'error', summary: 'Error', detail: res.message });
        return;
      }
      this.isSearchResultFound = true;
      this.searchResult = res.questions;
      let searchedResult = this.searchInputValue;
      this.searchKeywordTotalCount = res.pagination.total;

      searchedResult = searchedResult.split(" ");
      this.searchResult.map((data: any) => {
        let ans: any = '';
        //data.question = data.question;
        let searchedResult = this.searchInputValue;
        searchedResult = searchedResult.split(" ");
        searchedResult.forEach((element: any) => {
          const small = new RegExp(element, "i");
          data.question = data.question.replace(small, '<span class="fw-bold sec-color" style="color:#F0780C">' + element + '</span>');
        });
        // for (let x in searchedResult) {
        //   ans = ans.replace(new RegExp(x, 'g'), '<span class="fw-bold">' + x + '</span>');
        // }
      })
    }, err => {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: err });
    });
  }

  gerSelectedQuestion(selectedQuestionData: any) {
    this.selectedGlobalData = selectedQuestionData
    this.selectedQuestionData = selectedQuestionData;
    this.selectedQuestionId = selectedQuestionData.id;
    this.readQuestion(selectedQuestionData);
    if (this.timeLeft.plan === 'expired' || this.timeLeft.plan === 'subscription_expired') {
      this.visibleExhastedData = true;
    }
    else {
      this.isQuestionAnswerVisible = true;
    }
    this.searchResult.filter((res: any) => {
      if (res.id == selectedQuestionData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(selectedQuestionData);
    if (this.selectedQuestion < 1) {
      this.isAnswerDialogVisiblePrev = false;
    } else {
      this.isAnswerDialogVisiblePrev = true;
    }
    if (this.selectedQuestion >= this.searchResult.length - 1) {
      this.isAnswerDialogVisibleNext = false;
    } else {
      this.isAnswerDialogVisibleNext = true;
    }
  }

  clearText(): void {
    this.showCloseIcon = false;
    this.searchInputText = '';
    this.isSearchResultFound = false;
  }

  readQuestion(data: any): void {
    let readQueData = {
      questionId: data.id,
      countryId: data.country_id
    }
    this.moduleListService.readQuestion(readQueData);
    this.readQue$ = this.moduleListService.readQuestionMessage$();
  }

  getModuleName(selectedQuestionModule: any): void {
    this.selectedQuestion = this.searchResult.findIndex((x: any) => x.id === selectedQuestionModule.id);
    let moduleData: any;
    this.subs.sink = this.locationService.getUniPerpModuleList().subscribe(data => {
      this.moduleList = data.modules;
      data.modules.forEach((value: any) => {
        if (selectedQuestionModule.module_id == value.id) {
          moduleData = value;
          this.moduleName = value.module_name;
        }
      });
      this.getSubModuleByModule(moduleData, selectedQuestionModule);
    });
  }

  getSubModuleByModule(module: any, selectedQuestionModule: any): void {
    let data = {
      moduleid: module.id
    }
    this.locationService.getSubModuleByModule(data).subscribe(res => {
      if (res.status == 404) {

      }
      this.subModuleList = res.submodules;
      res.submodules.forEach((value: any) => {
        if (selectedQuestionModule.submodule_id == value.id) {
          this.subModuleName = value.submodule_name;
        }
      })
      this.breadCrumb = [{ label:  this.countryName}, { label: this.moduleName },
      { label: this.subModuleName }];
    })
  }

  breadCrumbClick(event: any, defaultEvent: any){
    if (defaultEvent.item.label == this.countryName){
      return;
    }
    this.searchInputText = '';
    if (event.model[1].label == defaultEvent.item.label){
      let slug = this.convertToSlug(event.model[1].label);
      this.isQuestionAnswerVisible = false;
      this.route.navigate([`/pages/modules/${slug}`]);
    } else {
      let slug = this.convertToSlug(event.model[1].label);
      this.isQuestionAnswerVisible = false;
      this.route.navigate([`/pages/modules/${slug}/question-list/${this.selectedGlobalData.submodule_id}`]);
    }
  }

  openChat(): void {
    this.route.navigate([`/pages/chat`]);
  }

  clickPrevious(carousel: any, event: any): void {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion <= 1) {
      this.isAnswerDialogVisiblePrev = false;
    }
    if (this.selectedQuestion <= 0) {
      return;
    }
    this.selectedQuestionId = this.selectedQuestion;
    this.selectedGlobalData = this.searchResult[this.selectedQuestion - 1];
    this.selectedQuestion = this.selectedQuestion - 1;
    let data = this.searchResult[this.selectedQuestion]
    this.searchResult.filter((res: any) => {
      if (res.id == data.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(data);
    carousel.navBackward(event, this.selectedQuestion);
    this.readQuestion(data);
  }

  clickNext(carousel: any, event: any) {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion >= this.searchResult.length - 2) {
      this.isAnswerDialogVisibleNext = false;
    }
    if (this.selectedQuestion >= this.searchResult.length - 1) {
      return;
    }

    this.selectedQuestionId = this.selectedQuestion;
    this.selectedGlobalData = this.searchResult[this.selectedQuestion + 1];
    this.selectedQuestion = this.selectedQuestion + 1;
    let data = this.searchResult[this.selectedQuestion];
    this.searchResult.filter((res: any) => {
      if (res.id == data.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(data);
    carousel.navForward(event, this.selectedQuestion);
    this.readQuestion(data);
  }

  // goToHome() {
  //     this.isQuestionAnswerVisible = false;
  // }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
    this.subs.unsubscribe();
  }

  redirectModule(moduleName: any) {
   
    let modName = this.convertToSlug(moduleName);
    modName= modName == "life-at-" ? "life-at-country" : modName;
    this.searchInputText = "";
    this.isSearchResultFound = false;
    if (this.timeLeft.plan === 'expired' || this.timeLeft.plan === 'subscription_expired') {
      this.visibleExhastedData = true;
    }
    else {
      this.route.navigate([`/pages/modules/${modName}`]);
    }
  }

  enableReadingData(): void {
    this.service.getNewUserTimeLeft().subscribe(res => {
      this.timeLeft = res.time_left;
    });
  }

  onClickSubscribedUser(): void {
    this.visibleExhastedData = false;
    this.route.navigate(["/pages/subscriptions"]);
  }

  redirectToSubmodule(data: any) {
    let modName = this.convertToSlug(data.module_name);
    this.searchInputText = "";
    this.isSearchResultFound = false;
    if (this.timeLeft.plan === 'expired' || this.timeLeft.plan === 'subscription_expired') {
      this.visibleExhastedData = true;
    } else {
      this.route.navigate([`/pages/modules/${modName}/question-list/${data.submodule_id}`]);
    }
  }

  convertToSlug(text: any) {
    return text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  clearButton(val: any) {
    this.searchInputText = "";
    this.isSearchResultFound = false;
  }
  onClickAsk() {
    this.route.navigate([`/pages/chat`]);
  }
  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }

  openReport() {
    let data = {
      isVisible: true,
      moduleId: this.selectedQuestionData.module_id,
      subModuleId: this.selectedQuestionData.submodule_id,
      questionId: this.selectedQuestionData.id,
      from: 'module'
    }
    this.dataService.openReportWindow(data);
  }

  reviewBy() {
    this.reviewedByOrgList = [];
    this.isReviewedByVisible = true;
    let request = {
      question_id: this.selectedQuestionId
    }
    this.moduleStoreService.GetReviewedByOrgLogo(request).subscribe((response) => {
      this.reviewedByOrgList = response;
    })
  }

  closeQuiz(): void {
    this.visibleExhastedData = false;
  }

  scrollRightVideo() {
    const container = this.videoLinksContainer.nativeElement;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    this.checkScrollPosition();
  }

  scrollLeftVideo() {
    const container = this.videoLinksContainer.nativeElement;
    const scrollAmount = -container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    this.checkScrollPosition();
  }

  scrollLeftRef() {
    const container = this.refLinksContainer.nativeElement;
    const scrollAmount = -container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    this.checkScrollPositionRef();
  }

  scrollRightRef() {
    const container = this.refLinksContainer.nativeElement;
    const scrollAmount = container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
     openNextVideo(){
       window.open(this.openNextPageLink)
     }

}
