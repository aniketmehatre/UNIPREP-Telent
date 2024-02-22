import {Component, HostListener, OnDestroy, OnInit, Output} from "@angular/core";
import {PageFacadeService} from "./page-facade.service";
import {SubSink} from "subsink";
import { NavigationEnd, Router } from "@angular/router";
import { DataService } from "../data.service";
import {DashboardService} from "./dashboard/dashboard.service";
import { AuthService } from "../Auth/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
    selector: "uni-pages",
    templateUrl: "./pages.component.html",
    styleUrls: ["./pages.component.scss"],
})
export class PagesComponent implements OnInit, OnDestroy {
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
    @Output() expandicon = !this.sidebarClass
        ? "pi-align-right"
        : "pi-align-justify";
    private subs = new SubSink();
    visibleExhastedUser!: boolean;
    constructor(private pageFacade: PageFacadeService, private router: Router, private dataService: DataService,
                private dashboardService: DashboardService,private service:AuthService,private deviceService: DeviceDetectorService) {
                    this.deviceCheck();
        router.events.subscribe((val) => {
            if(val instanceof NavigationEnd){
                if(val.url.includes('subscriptions') || val.url.includes('support-help')
                || val.url.includes('usermanagement')|| val.url.includes('chat') || val.url.includes('guideline')
                ||val.url.includes('termsandcondition')||val.url.includes('privacypolicy')||val.url.includes('refundpolicy')
                ||val.url.includes('cancellationpolicy')){
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
        this.subScribedUserCount();

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
}
