import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'uni-footer-status-box',
    templateUrl: './footer-status-box.component.html',
    styleUrls: ['./footer-status-box.component.scss']
})
export class FooterStatusBoxComponent implements OnInit {
    dashboardCount: any = [];

    constructor(private dashboardService: DashboardService, private toast: MessageService,
                private route: Router) {
    }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.dashboardService.getDashboardCounts().subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.dashboardCount = res;
        }, err => {
            this.toast.add({severity: 'Alert', summary: 'Alert', detail: err});
        });
    }

    askYourPersonalized(){
        this.route.navigate([`/pages/chat`]);
    }
    recentlyaddedquestions(){
        this.route.navigate([`recentlyaddedquestions`]);
    }

}
