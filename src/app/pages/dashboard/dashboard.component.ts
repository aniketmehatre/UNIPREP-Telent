
import {Component,Renderer2, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {AuthService} from "../../Auth/auth.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {DataService} from 'src/app/data.service';
import {MessageService} from "primeng/api";
import {combineLatest} from "rxjs";
import {select} from "@ngrx/store";
import {AnimationBuilder} from "@angular/animations";
import {Carousel, CarouselModule} from "primeng/carousel";

@Component({
    selector: 'uni-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
    partnerTrusterLogo: any;
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
        },
        {
            "image": "../../../uniprep-assets/images/icons/university3.svg",
        },
        {
            "image": "../../../uniprep-assets/images/icons/university3.svg",
        }
    ];
    selectedCountryId: any;
    currentSlide: any;
    freeTrial: boolean | undefined;

    constructor(private dashboardService: DashboardService, private builder: AnimationBuilder,
        private router: Router, private dataService: DataService, private toast: MessageService, private elRef: ElementRef, private renderer: Renderer2,
        private authService: AuthService
    ) {
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
        this.selectedCountryId = localStorage.getItem('countryId');
        this.checkNewUSerLogin();
        localStorage.setItem("currentmodulenameforrecently", '');
        this.dashboardService.getTrustedPartners().subscribe(partnerLogo => {
            this.partnerTrusterLogo = partnerLogo;
        });
        this.dashboardService.countryList().subscribe(countryList => {
            this.countryLists = countryList;
            this.countryLists.forEach((element: any) => {
                if (element.id == this.selectedCountryId) {
                    this.selectedCountryName = element.country;
                    this.selectedCountryId = element.id;
                    this.dataService.changeCountryName(element.country);
                }
            });
        });
        const section = this.elRef.nativeElement.querySelector('#horizontalScrollSection');
        this.renderer.listen(section, 'wheel', (event: WheelEvent) => {
            event.preventDefault();
            section.scrollLeft += event.deltaY;
        });
        //this.openViewMoreOrg();
        this.isViewMoreOrgVisible = false;
        this.loadApiData();
    }

    loadApiData(): void {

        localStorage.setItem('selectedcountryId',this.selectedCountryId)
        const data = {
            countryId: this.selectedCountryId,
        }
        combineLatest(
            this.dashboardService.getReadProgression({ countryId: this.selectedCountryId }),
            this.dashboardService.getQuizProgression({ countryId: this.selectedCountryId }),
            this.dashboardService.getModuleReadProgression(data),
            this.dashboardService.getModuleQuizProgression(data))
            .subscribe(([readProgression, quizProgression, getModuleReadProgression,
                getModuleQuizProgression]) => {
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

                if (getModuleReadProgression) {
                    this.readingProgressings = getModuleReadProgression.module;
                }
                if (getModuleReadProgression) {
                    this.quizProgressings = getModuleQuizProgression.module;
                }
            })
    }

    shareWithSocial(): void {
        this.isShareWithSocialMedia = true
    }

    closeReading(): void {
        this.continueReading = 'none'
    }

    openReading(): void {
        this.continueReading = "block";
    }

    closeQuiz(): void {
        this.continueQuiz = 'none'
    }

    openQuiz(): void {
        this.continueQuiz = "block";
    }


    selectCountry(selectedId: any): void {
        // if (selectedId != 2) {
        //     this.toast.add({
        //         severity: 'info',
        //         summary: 'Information',
        //         detail: "Currently United Kingdom only available"
        //     });
        //     return;
        // }
        this.countryLists.forEach((element: any) => {
            if (element.id === selectedId.id) {
                this.selectedCountryName = element.country;
            }
        });

        localStorage.setItem('countryId', selectedId.id);
        localStorage.setItem('selectedcountryId', selectedId.id);
        this.loadApiData();
        this.selectedCountryId = selectedId.id;
        this.dataService.changeCountryId(selectedId.id);
        this.dataService.changeCountryFlag(selectedId.flag)
        this.dataService.changeCountryName(selectedId.country)
        // this.countryListData(this.selectedCountryId);

        // this.modalQuizProgressing(selectedId);
        // this.modalReadingProgressing(selectedId);
        // this.loadReadProgression(selectedId);
        // this.loadQuizProgression(selectedId);
    }

    onClickReadProgression(data: any): void {
        let moduleName = "";
        switch (data.module_name) {
            case "Pre-Application":
                moduleName = "pre-application"
                break;
            case "Post-Application":
                moduleName = "post-application"
                break;
            case "Post-Admission":
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

    onClickQuizProgression(data: any): void {
        let moduleName = "";
        switch (data.module_name) {
            case "Pre-Application":
                moduleName = "pre-application"
                break;
            case "Post-Application":
                moduleName = "post-application"
                break;
            case "Post-Admission":
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

    openViewMoreOrg(): void {
        this.isViewMoreOrgVisible = true;
    }

    continueTrial(): void {
        this.freeTrial = false;
    }

    onClickSubscribe(): void {
        this.freeTrial = false;
        this.router.navigate(["/pages/subscriptions"]);
    }

    checkNewUSerLogin(): void{
        let userLoginCount = this.authService._userLoginCount;
        console.log(userLoginCount)
        if (userLoginCount === 4) {
            this.freeTrial = true;
        }
    }
}
