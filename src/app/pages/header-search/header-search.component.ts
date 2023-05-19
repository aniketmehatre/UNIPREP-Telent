import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {DataService} from "../../data.service";
import {MenuItem} from "primeng/api";
import {LocationService} from "../../location.service";
import {SubSink} from "subsink";

@Component({
    selector: 'uni-header-search',
    templateUrl: './header-search.component.html',
    styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
    message: any
    countryName: any
    isSearchResultFound: boolean = false;
    isQuestionAnswerVisible: boolean = false;
    searchResult: any;
    breadCrumb: MenuItem[] = [];
    positionNumber: number = 0;
    selectedQuestion: number = 0;
    responsiveOptions: any [] = [];
    data: any [] = [];
    moduleList: any;
    private subs = new SubSink();
    moduleName: any;
    subModuleName: any;
    searchInputValue: any;

    constructor(private dashboardService: DashboardService, private dataService: DataService,
                private locationService: LocationService) {
        this.dataService.chatTriggerSource.subscribe(message => {
            this.message = message;
        });
        this.dataService.countryNameSource.subscribe(countryName => {
            this.countryName = countryName;
        });
    }

    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    onSearchChange(event: any) {
        event == "" ? this.isSearchResultFound = false : '';
    }

    searchKeyWord(searchInput: any) {
        this.searchInputValue = searchInput.value;
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
            console.log(this.searchResult);
        }, err => {
            console.log('err', err);

        });
    }

    gerSelectedQuestion(selectedQuestionData: any) {
        this.isQuestionAnswerVisible = true;
        this.getModuleName(selectedQuestionData)
    }

    getModuleName(selectedQuestionModule: any) {
        // this.selectedQuestion = selectedQuestionModule.id;
        this.selectedQuestion = this.searchResult.findIndex((x: any) => x.id === selectedQuestionModule.id);
        let moduleData: any;
        this.subs.sink = this.locationService.getUniPerpModuleList().subscribe(data => {
            this.moduleList = data.modules;
            data.modules.forEach((value: any) => {
                if (selectedQuestionModule.module_id == value.id) {
                    moduleData = value;
                    this.moduleName = value.module_name;
                }
            });
            this.getSubModuleByModule(moduleData, selectedQuestionModule);
        });
    }

    getSubModuleByModule(module: any, selectedQuestionModule: any) {
        let data = {
            moduleid: module.id
        }
        this.locationService.getSubModuleByModule(data).subscribe(res => {
            if (res.status == 404) {

            }
            res.submodules.forEach((value: any) => {
                if (selectedQuestionModule.submodule_id == value.id) {
                    this.subModuleName = value.submodule_name;
                }
            })
            this.breadCrumb = [{label: 'United Kingdom'}, {label: this.moduleName},
                {label: this.subModuleName}];
        })
    }

    openChat() {
        this.dataService.changeChatOpenStatus("open chat window");
    }

    clickPrevious(carousel: any, event: any) {
        console.log(carousel)
        if (this.selectedQuestion <= 0) {
            return;
        }
        this.selectedQuestion = this.selectedQuestion - 1;
        let data = this.searchResult[this.selectedQuestion]
        this.getModuleName(data);
        carousel.navBackward(event, this.selectedQuestion)
    }

    clickNext(carousel: any, event: any) {
        if (this.selectedQuestion >= this.searchResult.length - 1) {
            return;
        }
        this.selectedQuestion = this.selectedQuestion + 1;
        let data = this.searchResult[this.selectedQuestion];
        this.getModuleName(data);
        carousel.navForward(event, this.selectedQuestion)
    }

    goToHome() {
        this.isQuestionAnswerVisible = false;
    }



    onClickRecommendedVideo() {

    }

    onClickAsk() {

    }

    onClickRecommendedLinks() {

    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
