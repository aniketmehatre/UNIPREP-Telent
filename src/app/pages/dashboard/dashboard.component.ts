import {Component, OnInit} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {AuthService} from "../../Auth/auth.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {DataService} from 'src/app/data.service';

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
                private router: Router, private dataService: DataService) {
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

        this.loadDashboardData();
        this.loadReadProgression(this.selectedCountryId);
        this.loadQuizProgression(this.selectedCountryId);
        this.modalReadingProgressing();
        this.modalQuizProgressing();
        // this.subs.sink = this.service.getMe().subscribe(data => {
        //     this.selectedCountryId = data.userdetails[0].interested_country_id;
        //     this.countryListData(this.selectedCountryId);
        // });
        this.countryListData(this.selectedCountryId);
    }

    loadDashboardData() {
        this.dashboardService.getDashboardCounts().subscribe((res: any) => {
            if (res.status === 404) {

                return;
            }
            this.dashboardCount = res;
        }, err => {
            console.log('err', err);

        });
    }

    loadReadProgression(countryId = 0) {
        this.dashboardService.getReadProgression({countryId: countryId}).subscribe((res: any) => {
            if (res.status === 404) {

                return;
            }
            this.readProgressionPercentage = Math.round(res.readpercentage);
        }, err => {
            console.log('err', err);

        });
    }

    loadQuizProgression(countryId = 0) {
        this.dashboardService.getQuizProgression({countryId: countryId}).subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.readQuizProgressionPercentage = Math.round(res.quizpercentage);
        }, err => {
            console.log('err', err);

        });
    }

    countryListData(selectedCountryId: number) {
        this.dashboardService.countryList().subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.countryLists = res;
            this.countryLists.forEach((element: any) => {
                if (element.id == selectedCountryId) {
                    this.selectedCountryName = element.country;
                    this.dataService.changeCountryName(element.country);
                }
            });
        }, err => {
            console.log('err', err);

        });
    }


    select(event: any) {
        console.log(event)
    }

    onSearchChange(event: any) {
        event == "" ? this.isSearchResultFound = false : '';
    }

    searchKeyWord(searchInput: any) {
        const data = {
            countryId: Number(localStorage.getItem('countryId')),
            searchtag: searchInput.value
        }
        this.dashboardService.searchKeyword(data).subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.isSearchResultFound = true;
            this.searchResult = res.questions;
        }, err => {
            console.log('err', err);

        });
    }


    modalReadingProgressing(countryId = 0) {
        let v = 'reading';
        const data = {
            countryId: countryId,
        }
        this.dashboardService.getModuleReadProgression(data).subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.readingProgressings = res.module;
        }, err => {
            console.log('err', err);

        });
    }

    modalQuizProgressing(countryId = 0) {
        let v = 'reading';
        const data = {
            countryId: countryId,
        }
        this.dashboardService.getModuleQuizProgression(data).subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.quizProgressings = res.module;
        }, err => {
            console.log('err', err);

        });
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
        this.countryLists.forEach((element: any) => {
            if (element.id === selectedId) {
                this.selectedCountryName = element.country;
            }
        });
        localStorage.setItem('countryId', selectedId);
        this.selectedCountryId = selectedId;
        this.dataService.changeCountryId(selectedId);
        this.countryListData(this.selectedCountryId);
        this.modalQuizProgressing(selectedId);
        this.modalReadingProgressing(selectedId);
        this.loadReadProgression(selectedId);
        this.loadQuizProgression(selectedId);
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
                moduleName = "career-hub"
                break;
            case "Life at ":
                moduleName = "career-hub"
                break;
        }
        this.router.navigate([`pages/${moduleName}/`]);
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
                moduleName = "career-hub"
                break;
        }
        this.router.navigate([`pages/${moduleName}/`]);
    }
}
