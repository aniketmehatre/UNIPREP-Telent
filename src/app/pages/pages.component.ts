import {Component, HostListener, OnDestroy, OnInit, Output} from "@angular/core";
import {PageFacadeService} from "./page-facade.service";
import {SubSink} from "subsink";
import { NavigationEnd, Router } from "@angular/router";
import { DataService } from "../data.service";
import {DashboardService} from "./dashboard/dashboard.service";
import { AuthService } from "../Auth/auth.service";

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
    MultiLoginPopup:string = '';
    @Output() expandicon = !this.sidebarClass
        ? "pi-align-right"
        : "pi-align-justify";
    private subs = new SubSink();
    constructor(private pageFacade: PageFacadeService, private router: Router, private dataService: DataService,
                private dashboardService: DashboardService,private service:AuthService) {
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
        this.MultiLoginPopup = 'none'; //If you want to show the popup change the value as "block"
    }

    onClickSubscribedUser(): void {
        this.visibleExhasted = false;
        this.router.navigate(["/pages/subscriptions"]);
    }

    subScribedUserCount(): void {
        this.service.getNewUserTimeLeft().subscribe(res => {
            let data = res.time_left;
            if (data.plan === 'expired') {
                this.visibleExhasted = true;
            } else {
                this.visibleExhasted = false;
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
    }
}
