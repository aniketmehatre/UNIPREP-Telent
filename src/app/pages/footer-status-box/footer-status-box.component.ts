import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService } from 'src/app/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'uni-footer-status-box',
    templateUrl: './footer-status-box.component.html',
    styleUrls: ['./footer-status-box.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule]
})
export class FooterStatusBoxComponent implements OnInit {
    dashboardCount: any = [];
    enableReading!: boolean;

    constructor(private dashboardService: DashboardService, private toast: MessageService,
                private route: Router , private service: AuthService) {
    }

    ngOnInit(): void {
        this.loadDashboardData();
        this.enableReadingData();
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
    recentlyAddedQuestions(){
        this.route.navigate([`/pages/question-list/recent`]);
    }

    popularQuestions(){
        this.route.navigate([`/pages/question-list/popular`]);
    }

    enableReadingData(): void {
        this.service.getNewUserTimeLeft().subscribe(res => {
            let data = res.time_left;
            if (data.plan === 'expired' || data.plan === 'subscription_expired') {
                this.enableReading = false;
            }
            else {
                this.enableReading = true;
            }
        });
    }
}
