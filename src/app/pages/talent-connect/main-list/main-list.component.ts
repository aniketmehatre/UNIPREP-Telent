import { ChangeDetectorRef, Component, OnInit, signal, } from '@angular/core';
import { environment } from "@env/environment";
import { TalentConnectService } from '../talent-connect.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { EmployeeConnectProfile } from 'src/app/@Models/employee-connect-profile';

@Component({
    selector: 'uni-main-list',
    standalone: false,
    templateUrl: './main-list.component.html',
    styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
    protected talentConnectMainList: any[] = []
    protected domainUrl: string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;
    isLoading: boolean = false;
    isProfileCreated: boolean = false;
    private dpImage = signal('');
    profileData: EmployeeConnectProfile[] = [];
    constructor(private router: Router, private talentConnectService: TalentConnectService, private messageService: MessageService,
        private cdr: ChangeDetectorRef, private authService: AuthService) {

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
            },
            // {
            //     id: 4,
            //     title: "Job Tracker",
            //     image: this.domainUrl + "TripLengthFinder.svg",
            //     value: '1 M+ JOBS',
            //     navigate_title: 'Track',
            //     navigate_url: '/pages/talent-connect/job-tracker',
            //     launch_soon: false,
            // },
            // {
            //     id: 5,
            //     title: "Company Tracker",
            //     image: this.domainUrl + "TripLengthFinder.svg",
            //     value: '1 M+ JOBS',
            //     navigate_title: 'Track',
            //     navigate_url: '/pages/talent-connect/company-tracker',
            //     launch_soon: false,
            // }
        ]
    }

    ngOnInit() {
        this.checkIfProfileCreated();
    }

    private checkIfProfileCreated() {
        this.isLoading = true;
        this.talentConnectService.getMyProfileData().subscribe({
            next: response => {
                this.isLoading = false;
                if (response && response.count) {
                    if (response.count > 0) {
                        this.dpImage.set(response.data[0].dp_image)
                        this.talentConnectMainList[0].image = response.data[0].dp_image;
                        this.isProfileCreated = true;
                        this.profileData = response.data;
                        this.cdr.detectChanges();
                    }
                }
                else {
                    const profileItem = this.talentConnectMainList.find(item => item.id === 1);
                    if (profileItem) {
                        profileItem.title = "Create Profile";
                    }
                }
            },
            error: error => {
                this.isLoading = false
                console.log('error while calling get profile!.')
            }
        });
    }


    checkAndNotAllowAccessModules(event: any, moduleId: number, url: string, launchMode: boolean) {
        if (this.authService.isInvalidSubscription('employer_connect')) {
            this.authService.hasUserSubscription$.next(true);
            return;
        }
        if (!this.isProfileCreated) {
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
            this.router.navigate([url, this.profileData[0].id]);
        }

    }
}
