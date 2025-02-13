import {Component, OnInit, OnDestroy} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService } from 'src/app/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { Subject, takeUntil, catchError, EMPTY, finalize } from 'rxjs';

@Component({
    selector: 'uni-footer-status-box',
    templateUrl: './footer-status-box.component.html',
    styleUrls: ['./footer-status-box.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, AccordionModule],
    providers: [MessageService, AuthService]
})
export class FooterStatusBoxComponent implements OnInit, OnDestroy {
    dashboardCount: any = [];
    enableReading!: boolean;
    isLoading: boolean = false;
    loadError: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private dashboardService: DashboardService,
        private toast: MessageService,
        private route: Router,
        private service: AuthService
    ) {}

    ngOnInit(): void {
        this.loadDashboardData();
        this.enableReadingData();

        // Subscribe to country changes to refresh data
        this.dashboardService.selectedCountry$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (!this.isLoading) {
                    this.loadDashboardData();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadDashboardData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.loadError = null;

        this.dashboardService.getDashboardCounts()
            .pipe(
                takeUntil(this.destroy$),
                catchError(err => {
                    this.loadError = this.getErrorMessage(err);
                    this.toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: this.loadError
                    });
                    return EMPTY;
                }),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (res: any) => {
                    if (res.status === 404) {
                        this.loadError = 'Dashboard data not available';
                        this.toast.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: this.loadError
                        });
                        return;
                    }
                    this.dashboardCount = res;
                }
            });
    }

    private getErrorMessage(err: any): string {
        if (err.name === 'TimeoutError') {
            return 'Request timed out. Please try again later.';
        }
        switch (err.status) {
            case 0:
                return 'Unable to connect to the server. Please check your internet connection.';
            case 401:
                return 'Please log in to view dashboard data';
            case 403:
                return 'You do not have permission to view this data';
            case 404:
                return 'Dashboard data not available';
            default:
                return err.message || 'Failed to load dashboard data';
        }
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
        this.service.getNewUserTimeLeft()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => {
                    // Cleanup if needed
                })
            )
            .subscribe({
                next: res => {
                    let data = res.time_left;
                    this.enableReading = !(data.plan === 'expired' || data.plan === 'subscription_expired');
                },
                error: err => {
                    console.error('Error loading user time left:', err);
                    this.enableReading = false;
                }
            });
    }
}
