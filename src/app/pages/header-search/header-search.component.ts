import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {DashboardService} from "../dashboard/dashboard.service";
import {DataService} from "../../data.service";
import {MenuItem} from "primeng/api";
import {LocationService} from "../../location.service";
import {SubSink} from "subsink";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ReadQuestion} from "../../@Models/read-question.model";
import {ModuleServiceService} from "../module-store/module-service.service";

@Component({
    selector: 'uni-header-search',
    templateUrl: './header-search.component.html',
    styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput', {static: false, read: ElementRef}) elRef: any;

    message: any
    countryName: any
    isSearchResultFound: boolean = false;
    isQuestionAnswerVisible: boolean = false;
    searchResult: any [] = [];
    breadCrumb: MenuItem[] = [];
    question: MenuItem[] = [];
    selectedQuestion: number = 0;
    responsiveOptions: any [] = [];
    data: any [] = [];
    moduleList: any;
    subModuleList: any;
    private subs = new SubSink();
    moduleName: any;
    subModuleName: any;
    searchInputValue: any;
    searchInputText: any;

    readQue$!: Observable<ReadQuestion[]>;
    @ViewChild('listgroup') listgroup: ElementRef | undefined;
    constructor(private dashboardService: DashboardService, private dataService: DataService,
                private moduleListService: ModuleServiceService, private locationService: LocationService,
                private route: Router, private elementRef: ElementRef, private renderer: Renderer2) {
        this.dataService.chatTriggerSource.subscribe(message => {
            this.message = message;
        });
        this.dataService.countryNameSource.subscribe(countryName => {
            this.countryName = countryName;
        });
        this.renderer.listen('window', 'click',(e:Event)=>{

            if(e.target !== this.elRef!.nativeElement){                
                this.isSearchResultFound=false;
                this.searchInputText = '';
                //this.searchResult  = [];
            }
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
                // this.subs.sink = this.locationService.getUniPerpModuleList().subscribe(data => {
                //     this.moduleList = data.modules;
                //     this.searchResult.map((data: any) => {
                //         let name = this.moduleList.find((x: any) => x.id == data.module_id);
                //         data.module_name = name.module_name;
                //     })
                // });
                // let data = {
                //     moduleid: 1
                // }
                // this.subs.sink = this.locationService.getSubModuleByModule(data).subscribe(res => {
                //     if (res.status == 404) {
                //
                //     }
                //     this.subModuleList = res.submodules;
                //     this.searchResult.map((data: any) => {
                //         let name = this.subModuleList.find((x: any) => x.id == data.submodule_id);
                //         if(name.submodule_name){
                //             data.submodule_name = name.submodule_name ? name.submodule_name : '';
                //         }
                //     })
                // });
        }, err => {
            console.log('err', err);

        });
    }

    gerSelectedQuestion(selectedQuestionData: any) {
        console.log(selectedQuestionData);
        this.readQuestion(selectedQuestionData);
        this.isQuestionAnswerVisible = true;
        this.getModuleName(selectedQuestionData)
    }

    clearText() {
        console.log('clear');
        
        this.searchInputText = '';
        this.isSearchResultFound = false;
        //this.searchResult = [];
    }

    readQuestion(data: any) {
        let readQueData = {
            questionId: data.id,
            countryId: data.country_id
        }
        this.moduleListService.readQuestion(readQueData);
        this.readQue$ = this.moduleListService.readQuestionMessage$();
    }

    getModuleName(selectedQuestionModule: any) {
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
            this.subModuleList = res.submodules;
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
        this.route.navigate([`/pages/chat`]);
        //this.dataService.changeChatOpenStatus("open chat window");
    }

    clickPrevious(carousel: any, event: any) {
        if (this.selectedQuestion <= 0) {
            return;
        }
        this.selectedQuestion = this.selectedQuestion - 1;
        let data = this.searchResult[this.selectedQuestion]
        this.getModuleName(data);
        carousel.navBackward(event, this.selectedQuestion)

        this.readQuestion(data);
    }

    clickNext(carousel: any, event: any) {
        if (this.selectedQuestion >= this.searchResult.length - 1) {
            return;
        }
        this.selectedQuestion = this.selectedQuestion + 1;
        let data = this.searchResult[this.selectedQuestion];
        this.getModuleName(data);
        carousel.navForward(event, this.selectedQuestion);
        this.readQuestion(data);
    }

    goToHome() {
        this.isQuestionAnswerVisible = false;
    }

    ngOnDestroy() {
        this.elementRef.nativeElement.remove();
        this.subs.unsubscribe();
    }

    redirectModule(moduleName: any) {
        let modName = this.convertToSlug(moduleName);
        this.searchInputText = "";
        this.isSearchResultFound = false;
        this.route.navigate([`/pages/modules/${modName}`]);
    }

    redirectToSubmodule(data: any) {
        let modName = this.convertToSlug(data.module_name);
        this.searchInputText = "";
        this.isSearchResultFound = false;
        this.route.navigate([`/pages/modules/${modName}/question-list/${data.submodule_id}`]);
    }

    convertToSlug(text: any) {
        return text.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    clearButton(val: any) {
        this.searchInputText = "";
        this.isSearchResultFound = false;
    }



}
