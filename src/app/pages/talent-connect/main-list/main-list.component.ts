import {Component, OnInit} from '@angular/core';
import {environment} from "@env/environment";

@Component({
    selector: 'uni-main-list',
    templateUrl: './main-list.component.html',
    styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
    protected talentConnectMainList: any [] = []
    protected domainUrl: string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;

    constructor() {
        this.talentConnectMainList = [
            {
                id: 1,
                title: 'Your Profile',
                image: this.domainUrl + "TripLengthFinder.svg",
                value: '1 M+ Profiles',
                navigate_title: 'Create Profile',
                navigate_url: '',
                launch_soon: false,
            },
            {
                id: 2,
                title: "Easy Apply",
                image: this.domainUrl + "TripLengthFinder.svg",
                value: '1 M+ JOBS',
                navigate_title: 'Apply',
                navigate_url: '',
                launch_soon: true,
            },
            {
                id: 3,
                title: "Company Connect",
                image: this.domainUrl + "TripLengthFinder.svg",
                value: '1 M+ JOBS',
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

    }
}
