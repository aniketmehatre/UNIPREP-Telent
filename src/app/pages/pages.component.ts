import {Component, HostListener, OnDestroy, OnInit, Output, ViewChild,ElementRef,} from "@angular/core";
import {PageFacadeService} from "./page-facade.service";
import {SubSink} from "subsink";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { DataService } from "../data.service";
import {DashboardService} from "./dashboard/dashboard.service";
import { AuthService } from "../Auth/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";

// @ts-ignore
import Contlo from 'contlo-web-sdk';
import {DomSanitizer,Meta, Title} from "@angular/platform-browser";

@Component({
    selector: "uni-pages",
    templateUrl: "./pages.component.html",
    styleUrls: ["./pages.component.scss"],
})
export class PagesComponent implements OnInit, OnDestroy {
    @ViewChild('videoFrame') videoFrame: ElementRef | undefined;

    sidebarClass = "";
    stickHeader = false;
    showSearch = false;
    isFooterBoxVisible = false;
    showReportSuccess = false;
    conditionSubscribed = true;
    visibleExhasted!: boolean;
    isDeviceStatusPopupView: boolean = false;
    MultiLoginPopup:string = '';
    isDeviceStatus: any = 'none';
    isLoggedInAnotherDevice: any = 'none';
    deviceInfo: any;
    howItWorksVideoModal: boolean = false;
    howItWorksVideoLink: any | null = null;


    ogTitle = '';
    ogDescription = 'UNIPREP is a one-stop platform for students, graduates & entrepreneurs, seeking information on Career, Life and Study abroad. Sign-up Now - Free!';
    ogImage = '../../uniprep-assets/images/uniprep-light.svg';

    @Output() expandicon = !this.sidebarClass
        ? "pi-align-right"
        : "pi-align-justify";
    private subs = new SubSink();
    visibleExhastedUser!: boolean;
    constructor(private pageFacade: PageFacadeService, private router: Router, private dataService: DataService,
                public meta: Meta, private titleService: Title, private route: ActivatedRoute,
                private dashboardService: DashboardService,private service:AuthService, private deviceService: DeviceDetectorService,private sanitizer:DomSanitizer) {
       // dev
        Contlo.init('d7a84b3a1d83fa9f7e33f7396d57ac88', 'https://dev-student.uniprep.ai');

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
            if(val instanceof NavigationEnd){
                if(val.url.includes('subscriptions') || val.url.includes('support-help')
                || val.url.includes('usermanagement')|| val.url.includes('chat') || val.url.includes('guideline')
                ||val.url.includes('termsandcondition')||val.url.includes('privacypolicy')||val.url.includes('refundpolicy')
                ||val.url.includes('cancellationpolicy') ||val.url.includes('export-credit')){
                    this.showSearch = false;
                    this.isFooterBoxVisible = false;
                }else{
                    this.showSearch = true;
                    this.isFooterBoxVisible = true;
                }
            }
        })
    } 

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    deviceCheck(){
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        var allowmobile = localStorage.getItem("allowmobile");
        if((isMobile || isTablet) && (!allowmobile)){
          this.isDeviceStatus = 'block';
          this.isDeviceStatusPopupView = false;
        }else{
          this.isDeviceStatus = 'none';
          this.isDeviceStatusPopupView = true;
        }
      }
    
      moveToDesktop(){
        this.isDeviceStatus = 'none';
        this.isDeviceStatusPopupView = true;
        localStorage.setItem("allowmobile",'1');
      }

    ngOnInit(): void {
        this.service.getTimeInfoForCard().subscribe((data) => {
            localStorage.setItem('time_card_info', data.card_message);
        });
        this.subScribedUserCount();
        this.videoPopupTrigger('refresh');
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
            if (data == 'block'){
                this.isLoggedInAnotherDevice = data;
                setTimeout(()=>{
                    window.sessionStorage.clear();
                    localStorage.clear();
                    this.router.navigateByUrl('/login');
                }, 10000);
            }

        });
        this.MultiLoginPopup = 'none'; //If you want to show the popup change the value as "block"
    }

    onClickSubscribedUser(): void {
        this.visibleExhasted = false;
        this.visibleExhastedUser = false;
        this.router.navigate(["/pages/subscriptions"]);
    }

    subScribedUserCount(): void {
        this.service.getNewUserTimeLeft().subscribe(res => {
            let data = res.time_left;
            if (data.plan === 'expired') {
                this.visibleExhasted = true;
                this.visibleExhastedUser = false;
            } else if (data.plan === 'subscription_expired') {
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

    selectedLink:string = "https://www.youtube.com/watch?v=3-5YyylOgKw";
    openVideoInYoutube(){
        console.log('Opening next video:', this.selectedLink);
        if (this.selectedLink) {
            window.open(this.selectedLink);
        }
    }

    closeVideoPopup(){
        if (this.videoFrame && this.videoFrame.nativeElement) {
            const player = this.videoFrame.nativeElement as HTMLIFrameElement;
            player.src = '';
        }
        this.howItWorksVideoLink = null;
        this.howItWorksVideoModal = false;
    }

    videoPopupTrigger(mode: string){
        console.log(mode,"video popup trigger");
        // if(mode != 'refresh'){
            this.pageFacade.videoPopupTrigger$.subscribe(() => {
                this.openVideoPopup();
              });
        // }
    }

    // vedio pop-up code
    openVideoPopup(): void {
        var link = "https://www.youtube.com/embed/3-5YyylOgKw?si=5QiGijrze5j370y5";
        const sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        // Check if it's a YouTube video link
        if (this.isYoutubeVideoLink(link)) {
            // If it's a YouTube video link, extract the video ID and construct the embeddable URL
            const videoId = this.extractYoutubeVideoId(link);
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            this.howItWorksVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        } else {
            // If it's not a YouTube video link, use the URL directly
            this.howItWorksVideoLink = sanitizedLink;
        }
        this.howItWorksVideoModal = false;
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
}
