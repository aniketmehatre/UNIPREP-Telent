import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService } from 'src/app/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'uni-footer-status-box',
    templateUrl: './footer-status-box.component.html',
    styleUrls: ['./footer-status-box.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, AccordionModule],
    providers: [DashboardService, MessageService, AuthService]
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
        console.log('Loading dashboard data...');
        this.dashboardService.getDashboardCounts().subscribe({
            next: (res: any) => {
                console.log('Dashboard data response:', res);
                if (res.status === 404) {
                    console.warn('Dashboard data not found');
                    this.toast.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Dashboard data not available'
                    });
                    return;
                }
                this.dashboardCount = res;
            },
            error: (err) => {
                console.error('Error loading dashboard data:', err);
                let errorMessage = 'Failed to load dashboard data';
                if (err.status === 0) {
                    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
                } else if (err.status === 401) {
                    errorMessage = 'Please log in to view dashboard data';
                } else if (err.status === 403) {
                    errorMessage = 'You do not have permission to view this data';
                }
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage
                });
            }
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
