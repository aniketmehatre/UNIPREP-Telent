import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DashboardService } from "../dashboard/dashboard.service";
import { DataService } from "../../data.service";
import { MenuItem, MessageService } from "primeng/api";
import { LocationService } from "../../location.service";
import { SubSink } from "subsink";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ReadQuestion } from "../../@Models/read-question.model";
import { ModuleServiceService } from "../module-store/module-service.service";
import { ModuleStoreService } from "../module-store/module-store.service";

@Component({
  selector: 'uni-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: false, read: ElementRef }) elRef: any;
  message: any
  countryName: any
  isSearchResultFound: boolean = false;
  isQuestionAnswerVisible: boolean = false;
  searchResult: any[] = [];
  searchKeyword: any;
  breadCrumb: MenuItem[] = [];
  question: MenuItem[] = [];
  selectedQuestion: number = 0;
  responsiveOptions: any[] = [];
  data: any[] = [];
  moduleList: any;
  subModuleList: any;
  private subs = new SubSink();
  moduleName: any;
  subModuleName: any;
  searchInputValue: any;
  searchInputText: any;
  showCloseIcon: boolean = false;
  isAnswerDialogVisiblePrev: boolean = false;
  isAnswerDialogVisibleNext: boolean = false;
  videoLinks: any[] = [];
  refLink: any[] = [];
  selectedQuestionData: any;
  reviewedByOrgList: any;
  selectedQuestionId: number = 0;
  isReviewedByVisible: boolean = false;
  readQue$!: Observable<ReadQuestion[]>;
  @ViewChild('listgroup') listgroup: ElementRef | undefined;
  constructor(private dashboardService: DashboardService, private dataService: DataService, private moduleStoreService: ModuleStoreService,
    private toastr: MessageService, private moduleListService: ModuleServiceService,
    private locationService: LocationService, private route: Router, private elementRef: ElementRef,
    private renderer: Renderer2) {
    this.dataService.chatTriggerSource.subscribe(message => {
      this.message = message;
    });
    this.dataService.countryNameSource.subscribe(countryName => {
      this.countryName = countryName;
    });
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.elRef!.nativeElement) {
        this.isSearchResultFound = false;
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
    this.searchKeyword = event;
    event == "" ? this.isSearchResultFound = false : '';
  }

  onKey(searchInput: any) {
    this.showCloseIcon = searchInput?.length > 0;
  }

  dataContentChange(test: any) {
    let searchValue = this.searchKeyword;
    const small = new RegExp(searchValue, "g");
    const caps = new RegExp(searchValue.toUpperCase(), "g");
    let newText = test.replace(small, '<span class="fw-bold">' + searchValue + '</span>')
    return newText.replace(caps, '<span class="fw-bold">' + searchValue + '</span>');
  }

  searchKeyWord(searchInput: any) {
    if (searchInput.value == "") {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: "Enter keyword to search data." });
      return;
    }
    this.searchInputValue = searchInput.value;
    const data = {
      countryId: Number(localStorage.getItem('countryId')),
      searchtag: searchInput.value
    }
    this.dashboardService.searchKeyword(data).subscribe((res: any) => {
      if (res.success === false) {
        this.toastr.add({ severity: 'error', summary: 'Error', detail: res.message });
        return;
      }
      this.isSearchResultFound = true;
      this.searchResult = res.questions;
    }, err => {
      console.log('err', err);
    });
  }

  gerSelectedQuestion(selectedQuestionData: any) {
    this.selectedQuestionData = selectedQuestionData;
    this.selectedQuestionId = selectedQuestionData.id;
    this.readQuestion(selectedQuestionData);
    this.isQuestionAnswerVisible = true;
    this.searchResult.filter((res: any) => {
      if (res.id == selectedQuestionData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(selectedQuestionData);
    if (this.selectedQuestion < 1) {
      this.isAnswerDialogVisiblePrev = false;
    } else {
      this.isAnswerDialogVisiblePrev = true;
    }
    if (this.selectedQuestion >= this.searchResult.length - 1) {
      this.isAnswerDialogVisibleNext = false;
    } else {
      this.isAnswerDialogVisibleNext = true;
    }
  }

  clearText(): void {
    this.showCloseIcon = false;
    this.searchInputText = '';
    this.isSearchResultFound = false;
  }

  readQuestion(data: any): void {
    let readQueData = {
      questionId: data.id,
      countryId: data.country_id
    }
    this.moduleListService.readQuestion(readQueData);
    this.readQue$ = this.moduleListService.readQuestionMessage$();
  }

  getModuleName(selectedQuestionModule: any): void {
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

  getSubModuleByModule(module: any, selectedQuestionModule: any): void {
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
      this.breadCrumb = [{ label: 'United Kingdom' }, { label: this.moduleName },
      { label: this.subModuleName }];
    })
  }

  openChat(): void {
    this.route.navigate([`/pages/chat`]);
  }

  clickPrevious(carousel: any, event: any): void {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion <= 1) {
      this.isAnswerDialogVisiblePrev = false;
    }
    if (this.selectedQuestion <= 0) {
      return;
    }
    this.selectedQuestionId = this.selectedQuestion;
    this.selectedQuestion = this.selectedQuestion - 1;
    let data = this.searchResult[this.selectedQuestion]
    this.searchResult.filter((res: any) => {
      if (res.id == data.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(data);
    carousel.navBackward(event, this.selectedQuestion);
    this.readQuestion(data);
  }

  clickNext(carousel: any, event: any) {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion >= this.searchResult.length - 2) {
      this.isAnswerDialogVisibleNext = false;
    }
    if (this.selectedQuestion >= this.searchResult.length - 1) {
      return;
    }

    this.selectedQuestionId = this.selectedQuestion;
    this.selectedQuestion = this.selectedQuestion + 1;
    let data = this.searchResult[this.selectedQuestion];
    this.searchResult.filter((res: any) => {
      if (res.id == data.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    this.getModuleName(data);
    carousel.navForward(event, this.selectedQuestion);
    this.readQuestion(data);
  }

  // goToHome() {
  //     this.isQuestionAnswerVisible = false;
  // }

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
  onClickAsk() {
    this.route.navigate([`/pages/chat`]);
  }
  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }

  openReport() {
    let data = {
      isVisible: true,
      moduleId: this.selectedQuestionData.module_id,
      subModuleId: this.selectedQuestionData.submodule_id,
      questionId: this.selectedQuestionData.id,
      from: 'module'
    }
    this.dataService.openReportWindow(data);
  }

  reviewBy() {
    this.reviewedByOrgList = [];
    this.isReviewedByVisible = true;
    let request = {
      question_id: this.selectedQuestionId
    }
    this.moduleStoreService.GetReviewedByOrgLogo(request).subscribe((response) => {
      this.reviewedByOrgList = response;
    })
  }

}
