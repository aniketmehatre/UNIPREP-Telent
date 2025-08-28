import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PagesService } from './store/pages.service';
import { AuthService } from '../Auth/auth.service';
import { TalentConnectService } from './talent-connect/talent-connect.service';
@Injectable({
    providedIn: 'root'
})
export class PageFacadeService {
    constructor(
        private pageService: PagesService,
        private authService: AuthService,
        private talentService: TalentConnectService
    ) {
    }

    sideBarState$(): Observable<boolean> {
        return this.pageService.selectSideBarState();
    }

    togleSideBar(state: boolean) {
        this.pageService.toggleSideBar(state);
    }


    public videoPopupTrigger = new BehaviorSubject<any>("");
    videoPopupTrigger$ = this.videoPopupTrigger.asObservable();

    openHowitWorksVideoPopup(data: any) {
        this.videoPopupTrigger.next(data);
    }

    sendWhatsappMessage(job_name: string, company_name: string) {
        if (this.authService._user.why_premium_message_sent === 0) {
            let data: {
                template_name: string;
                job_name: string;
                company_name: string;
            } = {
                template_name: "why_premium",
                job_name: job_name,
                company_name: company_name,
            };
            this.talentService.sendWatsappMess(data).subscribe({
                next: response => {
                    if (response.result) {
                        // this.authService._user.why_premium_message_sent = 1;
                    }
                }
            });
            // }
        }
    }
}
