import {Component, OnInit} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {AuthService} from "../../Auth/auth.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {DataService} from 'src/app/data.service';
import {MessageService} from "primeng/api";
import {combineLatest} from "rxjs";

@Component({
    selector: 'uni-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    dashboardCount: any = [];
    readProgressionPercentage: any;
    readQuizProgressionPercentage: any;
    responsiveOptions: any;
    selectedCountryName: any;
    readingProgressings: any = [];
    countryLists: any = [];
    quizProgressings: any = [];
    continueReading = "none";
    continueQuiz = "none";
    isSearchResultFound: boolean = false;
    isVideoVisible: boolean = false;
    isShareWithSocialMedia: boolean = false;
    isViewMoreOrgVisible: boolean = false;

    searchResult: any;
    university: any[] = [
        {
            "image": "../../../uniprep-assets/images/icons/university1.svg",
        },
        {
            "image": "../../../uniprep-assets/images/icons/university2.svg",
        },
        {
            "image": "../../../uniprep-assets/images/icons/university3.svg",
        }
    ];
    selectedCountryId: any;
    private subs = new SubSink();

    constructor(private dashboardService: DashboardService, private service: AuthService,
                private router: Router, private dataService: DataService, private toast: MessageService) {
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    ngOnInit(): void {
        this.selectedCountryId = 2;
        const data = {
            countryId: this.selectedCountryId,
        }
        combineLatest(this.dashboardService.getDashboardCounts(),
            this.dashboardService.getReadProgression({countryId: this.selectedCountryId}),
            this.dashboardService.getQuizProgression({countryId: this.selectedCountryId}),
            this.dashboardService.countryList(),
            this.dashboardService.getModuleReadProgression(data),
            this.dashboardService.getModuleQuizProgression(data))
            .subscribe(([dashboard, readProgression, quizProgression, countryList, getModuleReadProgression,
                            getModuleQuizProgression]) => {
                if (dashboard) {
                    if (dashboard.status === 404) {
                        return;
                    }
                    this.dashboardCount = dashboard.res;
                }
                if (readProgression) {
                    if (!readProgression.success) {

                        return;
                    }
                    this.readProgressionPercentage = Math.round(readProgression.readpercentage);
                }
                if (quizProgression) {
                    if (!quizProgression.success) {
                        return;
                    }
                    this.readQuizProgressionPercentage = Math.round(quizProgression.quizpercentage);
                }
                if(countryList){
                    this.countryLists = countryList;
                    this.countryLists.forEach((element: any) => {
                        if (element.id == this.selectedCountryId) {
                            this.selectedCountryName = element.country;
                            this.dataService.changeCountryName(element.country);
                        }
                    });
                }
                if(getModuleReadProgression){
                    this.readingProgressings = getModuleReadProgression.module;
                }
                if(getModuleReadProgression){
                    this.quizProgressings = getModuleQuizProgression.module;
                }
            })

    }

    shareWithSocial(){
        this.isShareWithSocialMedia = true
    }

    closeReading() {
        this.continueReading = 'none'
    }

    openReading() {
        this.continueReading = "block";
    }

    closeQuiz() {
        this.continueQuiz = 'none'
    }

    openQuiz() {
        this.continueQuiz = "block";
    }


    selectCountry(selectedId: any) {
        if (selectedId != 2) {
            this.toast.add({
                severity: 'info',
                summary: 'Information',
                detail: "Currently United Kingdom only available"
            });
            return;
        }
        this.countryLists.forEach((element: any) => {
            if (element.id === selectedId) {
                this.selectedCountryName = element.country;
            }
        });
        // localStorage.setItem('countryId', selectedId);
        // this.selectedCountryId = selectedId;
        // this.dataService.changeCountryId(selectedId);
        // this.countryListData(this.selectedCountryId);
        // this.modalQuizProgressing(selectedId);
        // this.modalReadingProgressing(selectedId);
        // this.loadReadProgression(selectedId);
        // this.loadQuizProgression(selectedId);
    }

    onClickReadProgression(data: any) {
        let moduleName = "";
        switch (data.module_name) {
            case "Pre Application":
                moduleName = "pre-application"
                break;
            case "Post Application":
                moduleName = "post-application"
                break;
            case "Post Admission":
                moduleName = "post-admission"
                break;
            case "Career Hub":
                moduleName = "career-hub"
                break;
            case "University":
                moduleName = "university"
                break;
            case "Life at ":
                moduleName = "life-at-country"
                break;
        }
        this.router.navigate([`pages/modules/${moduleName}/`]);
    }

    onClickQuizProgression(data: any) {
        let moduleName = "";
        switch (data.module_name) {
            case "Pre Application":
                moduleName = "pre-application"
                break;
            case "Post Application":
                moduleName = "post-application"
                break;
            case "Post Admission":
                moduleName = "post-admission"
                break;
            case "Career Hub":
                moduleName = "career-hub"
                break;
            case "University":
                moduleName = "career-hub"
                break;
            case "Life at ":
                moduleName = "life-at"
                break;
        }
        this.router.navigate([`pages/${moduleName}/sub-modules/2`]);
    }

    openViewMoreOrg(){
        this.isViewMoreOrgVisible = true;
    }
}
