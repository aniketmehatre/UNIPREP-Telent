
import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {AuthService} from "../../Auth/auth.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {DataService} from 'src/app/data.service';
import {combineLatest} from "rxjs";
import {Carousel, CarouselModule} from "primeng/carousel";

@Component({
    selector: 'uni-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
    private subs = new SubSink();
    userName: any;
    readProgressionPercentage: any;
    readQuizProgressionPercentage: any;
    responsiveOptions: any;
    selectedCountryName: any;
    readingProgressings: any;
    countryLists: any = [];
    quizProgressings: any = [];
    continueReading = "none";
    continueQuiz = "none";
    isVideoVisible: boolean = false;
    isShareWithSocialMedia: boolean = false;
    isViewMoreOrgVisible: boolean = false;
    partnerTrusterLogo: any;
    enableReading!: boolean;
    restrict: boolean = false;
    planExpired: boolean = false;
    @ViewChild('carousel') carousel!: Carousel;
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
    selectedCountryId: number = 1;
    headerFlag!: string;
    isLondon!: boolean;
    isCountryPopupOpen: any;
    currentModuleSlug: any;
    userData: any
    myProfilePercentage: any
    constructor(private dashboardService: DashboardService,private service: AuthService,
        private router: Router, private dataService: DataService,private authService: AuthService,
    ) {
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5,
                numScroll: 5
            },
            {
                breakpoint: '768px',
                numVisible: 4,
                numScroll: 4
            },
            {
                breakpoint: '560px',
                numVisible: 2,
                numScroll: 2
            }
        ];
    }
    ngOnInit(): void {
        this.checkplanExpire()
        this.selectedCountryId = Number(localStorage.getItem('countryId'));
        this.enableReadingData();
        //localStorage.setItem('selectedcountryId', this.selectedCountryId);
        
        localStorage.setItem("currentmodulenameforrecently", '');
        this.dashboardService.getTrustedPartners().subscribe(partnerLogo => {
            this.partnerTrusterLogo = partnerLogo;
        });
        this.dataService.countryFlagSource.subscribe((data) => {
            if (data != "") {
                this.headerFlag = data;
            }
        });
        this.dataService.countryId.subscribe((data) => {
            this.dashboardService.countryList().subscribe(countryList => {
                this.carousel.page = 0;
                this.countryLists = countryList;
                this.countryLists.forEach((element: any) => {
                    if (element.id == data) {
                        this.selectedCountryName = element.country;
                        this.selectedCountryId = element.id;
                        this.headerFlag = element.flag;
                    }
                });
                this.countryLists.forEach((item: any, i: any) => {
                    if(item.id === this.selectedCountryId){
                        this.countryLists.splice(i, 1);
                        this.countryLists.unshift(item);
                    }
                });
            });
        });

        this.subs.sink = this.service.getMe().subscribe((data) => {
            if (data) {
              this.userName = data.userdetails[0].name.toString()
              this.userData = data.userdetails[0]
              let nullCount = this.countNullValues(this.userData)
               let calValue = Math.round((nullCount / 75) * 100)
                this.progress = 100 - calValue
                this.setProgress(Math.round(this.progress))
            }
        });

        let data = {
            countryId: this.selectedCountryId,
        }
 
        this.dashboardService.countryList().subscribe(countryList => {
            this.countryLists = countryList;
            this.countryLists.forEach((element: any) => {
                if (element.id == this.selectedCountryId) {
                    this.selectedCountryName = element.country;
                    this.selectedCountryId = element.id;
                    this.dataService.changeCountryName(element.country);
                    this.dataService.changeCountryFlag(element.flag);
                }
            });
            this.countryLists.forEach((item: any, i: any) => {
                if(item.id === this.selectedCountryId){
                  this.countryLists.splice(i, 1);
                  this.countryLists.unshift(item);
                }
              });            
        });

        // const section = this.elRef.nativeElement.querySelector('#horizontalScrollSection');
        // this.renderer.listen(section, 'wheel', (event: WheelEvent) => {
        //     event.preventDefault();
        //     section.scrollLeft += event.deltaY;
        // });
        //this.openViewMoreOrg();
        this.isViewMoreOrgVisible = false;
        this.loadApiData();
        this.checkquizquestionmodule()
    }

    countNullValues(obj: { [key: string]: any }): number {
        let nullCnt = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] === null) {
                nullCnt++;
            }
        }
        return nullCnt;
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

    selectCountryInHeader(countryData: any) {
        this.dataService.changeCountryId(countryData.id)
        this.dataService.changeCountryName(countryData.country)
        this.dataService.changeCountryFlag(countryData.flag)
        localStorage.setItem('countryId', countryData.id);
        this.selectedCountryName = countryData.country;
        this.headerFlag = countryData.flag;
        this.ngOnInit();
    }

    loadApiData(): void {
        const data = {
            countryId: this.selectedCountryId,
        }
        //this.dashboardService.getModuleQuizProgression(data))
        //            this.dashboardService.getQuizProgression({ countryId: this.selectedCountryId }),
        combineLatest(
            this.dashboardService.getReadProgression({ countryId: this.selectedCountryId }),
            )
            .subscribe(([readProgression]) => {
                if (readProgression) {
                    if (!readProgression.success) {
                        return;
                    }
                    //this.readProgressionPercentage = Math.round(readProgression.readpercentage);
                    this.setProgress1(Math.round(readProgression.readpercentage))
                    this.progressReading = Math.round(readProgression.readpercentage)
                }
                // if (quizProgression) {
                //     if (!quizProgression.success) {
                //         return;
                //     }
                //     this.readQuizProgressionPercentage = Math.round(quizProgression.quizpercentage);
                // }
                // if (getModuleQuizProgression) {
                //     this.quizProgressings = getModuleQuizProgression.module;
                // }
            })
    }

    shareWithSocial(): void {
        this.isShareWithSocialMedia = true
    }

    closeReading(): void {
        this.continueReading = 'none'
    }

    openReading(): void {
        let data = {
            countryId: this.selectedCountryId,
        }

        this.dashboardService.getModuleReadProgression(data).subscribe(response => {
            this.readingProgressings = response.module;
            this.continueReading = "block";
        });
       
    }

    closeQuiz(): void {
        this.continueQuiz = 'none'
    }

    openQuiz(): void {
        // dont remove comments
        if(this.planExpired){
            this.restrict=true;
            return;
          }
        // this.continueQuiz = "block";
        // this.checkQuestionQuiz()
        this.router.navigate([`pages/modules/quizmodule`]);
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
            case "Pre Admission":
                moduleName = "pre-admission"
                break;
            case "Travel and Tourism":
                moduleName = "travel-and-tourism"
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
            case "Travel And Tourism":
                moduleName = "travel-and-tourism"
                break;
            case "Life at ":
                moduleName = "life-at-country"
                break;
        }
        this.router.navigate([`pages/modules/${moduleName}/`]);
    }


    openCertificate(){
        this.router.navigate([`pages/mycertificate`]);
    }

    onClickQuizProgression(data: any): void {
        let moduleName = "";
        switch (data.module_name) {
            case "Pre-Admission":
                moduleName = "pre-admission"
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
            case "Travel And Tourism":
                moduleName = "travel-and-tourism"
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
    quizpercentage:any=0;
    checkquizquestionmodule(){
      var data={
        countryid: this.selectedCountryId
      }
      this.dashboardService.checkModuleQuizCompletion(data).subscribe((res) => {
        this.quizpercentage=res.progress
      })
    }
    checkQuestionQuiz(){
        var data={
            countryid: this.selectedCountryId
          }
          this.dashboardService.checkModuleQuizProgressbar(data).subscribe((res) => {
            this.quizProgressings=res.modules.filter((module:any) => module.id !== 7);
          })
    }
    startQuiz(moduleid:any) {
        if(moduleid==1){
          this.currentModuleSlug="pre-admission"
        }else if(moduleid==3){
          this.currentModuleSlug="post-admission"
        }else if(moduleid==4){
          this.currentModuleSlug="career-hub"
        }else if(moduleid==6){
          this.currentModuleSlug="life-at-country"
        }else if(moduleid==7){
            this.currentModuleSlug="travel-and-tourism"
          }
        this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
      }
      checkplanExpire(): void {
        this.authService.getNewUserTimeLeft().subscribe((res) => {
          let data = res.time_left;
          let subscription_exists_status = res.subscription_details;
          if (data.plan === "expired" || data.plan === 'subscription_expired') {
            this.planExpired = true;   
          } else {
            this.planExpired = false;
          }
        })
      }
      upgradePlan(): void {
        this.router.navigate(["/pages/subscriptions"]);
      }
      clearRestriction() {
        this.restrict = false;
      }

    openMyProfile(){
        this.router.navigate(["/pages/usermanagement"]);
    }

    @Input() progress: number = 0;
    @Input() progressReading: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['progress']) {
            this.setProgress(this.progress);
        }
        if (changes['progressReading']) {
            this.setProgress1(this.progressReading);
        }
    }

    setProgress(progress: number) {
        const circle = document.querySelector('.progress-ring__circle') as SVGCircleElement;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${offset}`;
    }

    setProgress1(progress: number) {
        const circle = document.querySelector('.progress1-ring__circle') as SVGCircleElement;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${offset}`;
    }
}
