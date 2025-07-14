import { Component, OnInit } from '@angular/core';
import { environment } from "@env/environment";
import { TalentConnectService } from '../talent-connect.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { PageFacadeService } from '../../page-facade.service';

@Component({
    selector: 'uni-main-list',
    standalone: false,
    templateUrl: './main-list.component.html',
    styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
    protected talentConnectMainList: any[] = []
    protected domainUrl: string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;

    constructor(private router: Router, private talentConnectService: TalentConnectService, private messageService: MessageService,
        private authService: AuthService, private pageFacade: PageFacadeService) {

        this.talentConnectMainList = [
            {
                id: 1,
                title: 'YOUR PROFILE',
                image: './uniprep-assets/images/employer-connect/YourProfile.svg',
                value: '1 M+ Profiles',
                navigate_title: 'Create Profile',
                navigate_url: '/pages/talent-connect/my-profile',
                launch_soon: false,
            },
            {
                id: 2,
                title: "EASY APPLY",
                image: './uniprep-assets/images/employer-connect/EasyApply.svg',
                value: '1 M+ JOBS',
                navigate_title: 'Apply',
                navigate_url: '/pages/talent-connect/easy-apply',
                launch_soon: false,
            },
            {
                id: 3,
                title: "COMPANY CONNECT",
                image: './uniprep-assets/images/employer-connect/CompanyConnect.svg',
                value: '100+ Companies',
                navigate_title: 'Connect',
                navigate_url: '/pages/talent-connect/company-connect',
                launch_soon: false,
            }
        ]
    }

    ngOnInit() {
        this.checkIfProfileCreated();
    }

    checkIfProfileCreated() {
        if (this.talentConnectService._employerProfileData?.profile_completion_flag) {
            this.talentConnectMainList[0].image = this.talentConnectService._employerProfileData?.dp_image ?? 'uniprep-assets/images/employer-connect/YourProfile.svg';
        }
        else {
            this.talentConnectMainList[0].title = 'Create Profile';
        }
    }


    checkAndNotAllowAccessModules(event: any, moduleId: number, url: string, launchMode: boolean) {
        if (this.authService.isInvalidSubscription('employer_connect')) {
            this.authService.hasUserSubscription$.next(true);
            return;
        }
        if (!this.talentConnectService._employerProfileData?.profile_completion_flag) {
            if (moduleId === 2 || moduleId === 3) {
                event.preventDefault();
                event.stopPropagation();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Please create your profile first!'
                });
                return;
            }
            if (moduleId == 1) {
                this.router.navigateByUrl(url);
            }
        } else {
            if (moduleId == 1) {
                this.router.navigate([url, this.talentConnectService._employerProfileData?.id]);
            }
            else {
                this.router.navigateByUrl(url);
            }
        }

    }

    openVideoPopup() {
        this.pageFacade.openHowitWorksVideoPopup("company-connect");
    }
}
