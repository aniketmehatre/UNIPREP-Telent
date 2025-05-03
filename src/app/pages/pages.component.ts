import { Component, ElementRef, HostListener, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { PageFacadeService } from "./page-facade.service";
import { SubSink } from "subsink";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router";
import { DataService } from "../data.service";
import { DashboardService } from "./dashboard/dashboard.service";
import { AuthService } from "../Auth/auth.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { CommonModule } from "@angular/common";
// @ts-ignore
import Contlo from "contlo-web-sdk";
import { DomSanitizer, Meta, SafeResourceUrl, Title } from "@angular/platform-browser";
import { LocationService } from "../location.service";
import { HeaderComponent } from "@theme/components/header/header.component";
import { SidenavComponent } from "@theme/components/sidenav/sidenav.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { HeaderSearchComponent } from "./header-search/header-search.component"
import { StorageService } from "../storage.service";
import { RestrictionDialogComponent } from "../shared/restriction-dialog/restriction-dialog.component";

@Component({
  selector: "uni-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    HeaderComponent,
    SidenavComponent,
    HeaderSearchComponent,
    RestrictionDialogComponent
  ],
})
export class PagesComponent implements OnInit, OnDestroy {
  @ViewChild("videoFrame") videoFrame: ElementRef | undefined;
  hovered: 'ai' | null = null;
  hovered1: 'wa' | null = null;

  sidebarClass = "";
  stickHeader = false;
  showSearch = false;
  isFooterBoxVisible = false;
  showReportSuccess = false;
  conditionSubscribed = true;
  visibleExhasted!: boolean;
  isDeviceStatusPopupView: boolean = false;
  MultiLoginPopup: string = "";
  isDeviceStatus: any = "none";
  isLoggedInAnotherDevice: any = "none";
  deviceInfo: any;
  howItWorksVideoModal: boolean = false;
  howItWorksVideoLink: SafeResourceUrl | null = null;
  imageUrlWhitelabel: string | null = null;
  footerIsShow: boolean = true;
  ogTitle = "";
  ogDescription = "UNIPREP is a one-stop platform for students, graduates & entrepreneurs, seeking information on Career, Life and Study abroad. Sign-up Now - Free!";
  ogImage = "../../uniprep-assets/images/uniprep-light.svg";
  ehitlabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  isPageLoad!: boolean;

  @Output() expandicon = !this.sidebarClass ? "pi-align-right" : "pi-align-justify";
  private subs = new SubSink();
  visibleExhastedUser!: boolean;
  restrict: boolean = false;

  constructor(private pageFacade: PageFacadeService, private router: Router, private dataService: DataService,
    public meta: Meta, private locationService: LocationService,
    private service: AuthService, private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer, private storage: StorageService) {
    // dev
    //  Contlo.init('d7a84b3a1d83fa9f7e33f7396d57ac88', 'https://dev-student.uniprep.ai');

    //prod
    //Contlo.init('a98318a62995cdf7c078c3fcaf912e65', 'https://uniprep.ai');

    // Contlo.User.sendUserData({
    //      email: 'vivekbasvivek@gmail.com',
    //      name: 'Vivek BM'
    //  });
    // contlo.ContloWebSDK.sendUserData(email, phone no, first name, last name,{subscribed_channels : [channel list]}
    // is_profile_update)s
    //this.titleService.setTitle('Study Abroad | Global opportunities | Life Abroad | UNIPREP');

    this.deviceCheck();
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.includes("subscriptions") || val.url.includes("dashboard") || val.url.includes("userguide")
          || val.url.includes("support-help") || val.url.includes("usermanagement") || val.url.includes("chat")
          || val.url.includes("guideline") || val.url.includes("termsandcondition") || val.url.includes("privacypolicy")
          || val.url.includes("refundpolicy") || val.url.includes("cancellationpolicy") || val.url.includes("export-credit")
          || val.url.includes("cv-builder") || val.url.includes("coverletter-builder") || val.url.includes("talent-connect")) {
          this.showSearch = false;
          //this.isFooterBoxVisible = false;
        } else {
          this.showSearch = true;
          //this.isFooterBoxVisible = true;
        }

        if (val.url.includes("dashboard")) {
          this.isFooterBoxVisible = true;
        } else {
          this.isFooterBoxVisible = false;
        }
      }
    });
    this.service.hasUserSubscription$.subscribe(value => {
      this.restrict = value;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  deviceCheck() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    var allowmobile = this.storage.get("allowmobile");
    if ((isMobile || isTablet) && !allowmobile) {
      this.isDeviceStatus = "block";
      this.isDeviceStatusPopupView = false;
    } else {
      this.isDeviceStatus = "none";
      this.isDeviceStatusPopupView = true;
    }
  }

  moveToDesktop() {
    this.isDeviceStatus = "none";
    this.isDeviceStatusPopupView = true;
    this.storage.set("allowmobile", "1");
  }
  enterpriseSubscriptionLink: any;
  imagewhitlabeldomainname: any;
  ngOnInit(): void {
    this.locationService.getOrgName().subscribe((orgname) => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    this.ehitlabelIsShow = this.imagewhitlabeldomainname === "*.uniprep.ai" ||
      this.imagewhitlabeldomainname === "dev-student.uniprep.ai" ||
      this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost"
      || this.imagewhitlabeldomainname === "meta.uniprep.ai";
    this.imagewhitlabeldomainname = window.location.hostname;
    this.footerIsShow = this.imagewhitlabeldomainname === "*.uniprep.ai" ||
      this.imagewhitlabeldomainname === "dev-student.uniprep.ai" ||
      this.imagewhitlabeldomainname === "uniprep.ai" ||
      this.imagewhitlabeldomainname === "localhost" ||
      this.imagewhitlabeldomainname === "meta.uniprep.ai";
    this.locationService.getImage().subscribe((imageUrl) => {
      this.imageUrlWhitelabel = imageUrl;
    });
    this.service.getTimeInfoForCard().subscribe((data) => {
      this.storage.set("time_card_info", data.card_message);
    });
    this.subScribedUserCount();
    // this.videoPopupTrigger('refresh');
    this.subs.sink = this.pageFacade.sideBarState$().subscribe({
      next: (state) => {
        this.sidebarClass = state ? "active" : "";
      },
    });
    this.dataService.showFeedBackSource.subscribe((data) => {
      if (data) {
        this.showReportSuccess = true;
      } else {
        this.showReportSuccess = false;
      }
    });
    this.dataService.showLoggedInAnotherDevice.subscribe((data) => {
      if (data == "block") {
        this.isLoggedInAnotherDevice = data;
        setTimeout(() => {
          window.sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl("/login");
        }, 10000);
      }
    });
    this.MultiLoginPopup = "none"; //If you want to show the popup change the value as "block"
    this.howItWorksVideoModal = false;
    this.howItWorksVideoLink = null;
    this.pageFacade.videoPopupTrigger$.subscribe((data) => {
      if (data && this.isPageLoad) {
        // while loading the first time the popup will hide. next time only i needs to show.
        this.openVideoPopup(data);
      }
      this.isPageLoad = true; // after page loading completed this will changed because first time needs to hide the how it works popup
    });
  }

  onClickSubscribedUser(): void {
    this.visibleExhasted = false;
    this.visibleExhastedUser = false;
    if (this.enterpriseSubscriptionLink != "") {
      window.open(this.enterpriseSubscriptionLink, "_target");
      return;
    }
    this.router.navigate(["/pages/subscriptions"]);
  }

  subScribedUserCount(): void {
    this.service.getNewUserTimeLeft().subscribe((res) => {
      this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
      let data = res.time_left;
      if (data.plan === "expired") {
        this.visibleExhasted = true;
        this.visibleExhastedUser = false;
      } else if (data.plan === "subscription_expired") {
        this.visibleExhastedUser = true;
        this.visibleExhasted = false;
      } else {
        this.visibleExhasted = false;
        this.visibleExhastedUser = false;
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    if (event.target.innerWidth > 765 && this.sidebarClass) {
      this.pageFacade.togleSideBar(true);
    }
  }

  onWindowScroll(event: any) {
    if (event.srcElement.scrollTop < 70) {
      this.stickHeader = false;
    } else {
      this.stickHeader = true;
    }
  }

  togleSidebar() {
    this.pageFacade.togleSideBar(!this.sidebarClass);
  }

  closeQuiz(): void {
    this.visibleExhasted = false;
    this.visibleExhastedUser = false;
  }

  // selectedLink:string = "https://www.youtube.com/watch?v=3-5YyylOgKw";
  openVideoInYoutube() {
    if (!this.howItWorksVideoLink) return;

    // Get the raw URL string from SafeResourceUrl
    const safeUrl = this.howItWorksVideoLink.toString();
    const embedUrl = safeUrl.replace('unsafe:', ''); // Remove 'unsafe:' prefix if present

    // Extract video ID from embed URL
    const videoId = embedUrl.split('/embed/')[1]?.split('?')[0];
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, '_blank');
    }
  }

  closeVideoPopup() {
    if (this.videoFrame && this.videoFrame.nativeElement) {
      const player = this.videoFrame.nativeElement as HTMLIFrameElement;
      player.src = '';
    }
    this.howItWorksVideoLink = null;
    this.howItWorksVideoModal = false;
  }

  // vedio pop-up code
  openVideoPopup(link: string): void {
    if (!link) return;

    this.howItWorksVideoModal = true;
    try {
      if (this.isYoutubeVideoLink(link)) {
        const videoId = this.extractYoutubeVideoId(link);
        if (videoId) {
          // Create a safe embed URL
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          this.howItWorksVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        } else {
          console.error('Invalid YouTube video ID');
          this.howItWorksVideoModal = false;
        }
      } else {
        // For non-YouTube videos, ensure the URL is valid before sanitizing
        const url = new URL(link); // This will throw if URL is invalid
        this.howItWorksVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
      }
    } catch (error) {
      console.error('Error processing video URL:', error);
      this.howItWorksVideoModal = false;
    }
  }

  private isYoutubeVideoLink(link: string): boolean {
    if (!link) return false;
    return link.toLowerCase().includes('youtube.com') || link.toLowerCase().includes('youtu.be');
  }

  private extractYoutubeVideoId(url: string): string | null {
    if (!url) return null;

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#\&\?]*).*/,
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }

    return null;
  }

  onCloseRestrictModal(event: boolean) {
    this.service.hasUserSubscription$.next(event);
  }
}
