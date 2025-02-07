import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { ModuleServiceService } from '../module-store/module-service.service';
import { ModuleStoreService } from '../module-store/module-store.service';

@Component({
  selector: 'uni-header-search-module',
  templateUrl: './header-search-module.component.html',
  styleUrls: ['./header-search-module.component.scss']
})
export class HeaderSearchModuleComponent implements OnInit {
  showCloseIcon: boolean = false;
  searchLearning: any;
  isSearchResultFound: boolean = false;
  allSearchedResult: any[] = []
  filteredData: any[] = [];
  currentRoute: string = '';
  flobalsearchbuttonname:any;
  flobalsearchbuttonplaceholder:any;
  constructor(private dataService: DataService, private moduleStoreService: ModuleStoreService,
    private toastr: MessageService, private moduleListService: ModuleServiceService, private sanitizer: DomSanitizer,
    private locationService: LocationService, private router: Router, private elementRef: ElementRef, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    if (this.currentRoute.includes('learning-hub')) {
      this.flobalsearchbuttonname="Module";
      this.flobalsearchbuttonplaceholder="Enter Your Keywords Here"
      console.log("1");
      this.moduleListService.TransferSubmoduleAndSpecializationForGlobalSearch().subscribe({
        next: (res: any) => {
          this.allSearchedResult = res; 
          console.log(this.allSearchedResult);
        },
        error: (err) => {
          console.error("Error fetching data:", err);
        }
      });
    }else if(this.currentRoute.includes('k12')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Subject";
      this.flobalsearchbuttonplaceholder="Search for a subject"
      console.log("1");
    }else if(this.currentRoute.includes('unilearn')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Module";
      this.flobalsearchbuttonplaceholder="Enter Your Keywords Here"
      console.log("1");
    }else if(this.currentRoute.includes('startup')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Files";
      this.flobalsearchbuttonplaceholder="Search for startup kits"
    }else if(this.currentRoute.includes('resource')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Resources";
      this.flobalsearchbuttonplaceholder="Search for Resources"
    }else if(this.currentRoute.includes('events')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Events";
      this.flobalsearchbuttonplaceholder="Search for events"
    }else if(this.currentRoute.includes('success-stories')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Stories";
      this.flobalsearchbuttonplaceholder="Search for success stories"
    }
    else if(this.currentRoute.includes('tutorials')){
      this.allSearchedResult=[]
      this.flobalsearchbuttonname="Tutorials";
      this.flobalsearchbuttonplaceholder="Search for tutorials"
    }
  }
  // handleRouteChange() {
  //   const currentRoute = this.activatedRoute.snapshot.routeConfig?.path;
  //   console.log('Handling route:', currentRoute);
  // }
  searchKeyWord(searchInput: any) {
    if (searchInput.value == "") {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: "Enter keyword to search data." });
      return;
    }
  }
  clearText(): void {
    this.showCloseIcon = false;
    this.searchLearning = '';
    this.isSearchResultFound = false;
    this.filteredData = [];
  }
  takeMeToQuestion(data: any) {
    this.router.navigate([`/pages/modules/learning-hub/question-list/${data.submodule_id}`]);
  }
  performSearch() {
    if (this.searchLearning) {
      console.log(this.allSearchedResult);
      this.filteredData = this.allSearchedResult
        .filter((item: any) =>
          item.submodule_name.toLowerCase().includes(this.searchLearning.toLowerCase()) ||
          item.category_name.toLowerCase().includes(this.searchLearning.toLowerCase())
        )
        .map(item => ({
          title: item.category_name,
          subtitle: item.submodule_name,
          category_id: item.category_id,
          submodule_id: item.submodule_id
        }));
    }
    else {
      this.filteredData = [];
  }
  }
}
