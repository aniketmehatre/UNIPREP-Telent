import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Accordion, AccordionModule } from "primeng/accordion";
import { InformationService } from "./information.service";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

import { MultiSelectModule } from "primeng/multiselect";
import { Router } from "@angular/router";
import { AuthService } from "src/app/Auth/auth.service";
import { PaginatorModule } from "primeng/paginator";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { PageFacadeService } from "../page-facade.service";
import { LocationService } from "src/app/services/location.service";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "uni-infokit",
  standalone: true,
  imports: [FormsModule, CommonModule, InputTextModule, TabViewModule, TableModule, AccordionModule, ReactiveFormsModule, MultiSelectModule, PaginatorModule, TooltipModule, DialogModule, ButtonModule],
  templateUrl: "./infokit.component.html",
  styleUrls: ["./infokit.component.scss"],
})
export class InfoKitComponent implements OnInit {
  planExpired!: boolean;
  searchText: any;
  allFoldersAndFiles: any[] = [];
  filteredFiles: any[] = [];
  constructor(private fb: FormBuilder, private service: InformationService, private toastr: MessageService, private route: Router, private authService: AuthService, private pageFacade: PageFacadeService, private locationService: LocationService) {

  }
  titletext = "STARTUP KIT";
  folderdata: any = {};
  routedata: any = [];
  parentfolderlists: any = [];
  parentfilelists: any = [];
  totalcount = 0;
  ngOnInit() {
    this.checkplanExpire();
    this.folderdata = {
      parent_id: 0,
      page: 1,
      perpage: 10,
    };
    this.getFolderData();
    this.getFileteredData();
  }
  getFileteredData() {
    this.service.getAllFolderAndFiles().subscribe((res) => {
      this.allFoldersAndFiles = res;
      // console.log(this.allFoldersAndFiles, "all folder and files");
    });
  }
  getFolderData() {
    this.searchText = "";
    this.service.GetFolderList(this.folderdata).subscribe((res) => {
      this.totalcount = res?.count;
      let responseData = res?.data;
      this.parentfolderlists = responseData.filter((fdata: any) => fdata.isFolder == 1);
      this.parentfilelists = responseData.filter((fdata: any) => fdata.isFolder == 2);
      // this.originalFolderLists = [...this.parentfolderlists];
      // this.originalFileLists = [...this.parentfilelists];
    });
  }
  filterLists() {
    if (this.searchText.length > 1) {
      this.filteredFiles = this.allFoldersAndFiles.filter((file: any) => {
        if (file.isFolder == 1) {
          file.icon_path = file.img_path;
        } else {
          file.icon_path = "../../../uniprep-assets/images/pdf.svg";
        }
        return file.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
    } else {
      this.filteredFiles = [];
    }
  }
  pageChange(event: any) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.folderdata.page = event.page + 1;
    this.folderdata.perpage = event.rows;
    this.getFolderData();
  }
  getchildinfo(data: any) {
    if (data.isFolder == "2") {
      return;
    }
    this.folderdata.parent_id = data.id;
    if (data.parent_id == "0") {
      this.titletext = data.name;
    }
    this.routedata.push({
      id: data.id,
      name: data.name,
      data: data,
      path: "country",
    });
    this.getFolderData();
  }
  clikSearchFolder(data: any) {
    if (data.isFolder == "2") {
      return;
    }
    this.folderdata.parent_id = data.id;
    if (data.parent_id == "0") {
      this.titletext = data.name;
    }
    this.routedata = [];
    if (data.full_array) {
      data.full_array.forEach((element: any) => {
        this.routedata.push({
          id: element.id,
          name: element.name,
          data: element,
          path: "country",
        });
      });
      this.routedata.push({
        id: data.id,
        name: data.name,
        data: data,
        path: "country",
      });
    }
    this.getFolderData();
    this.filteredFiles = [];
    this.searchText = "";
  }
  actionedrouteData: any = [];
  redirectTo(path: any, arrayindex: number) {
    if (path.path == "country") {
      this.folderdata.parent_id = path.id;
      this.actionedrouteData = [];
      this.routedata.forEach((rdata: any, index: number) => {
        if (index <= arrayindex) {
          this.actionedrouteData.push(rdata);
        }
      });
      this.routedata = this.actionedrouteData;
      this.getFolderData();
    } else {
      if (path == "startup") {
        this.folderdata.parent_id = "0";
        this.routedata = [];
        this.getFolderData();
      }
      this.route.navigate(["pages/" + path]);
    }
  }
  openFile(url: any) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    window.open(url, "_blank");
    this.filteredFiles = [];
    this.searchText = "";
  }

  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "free_trail" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Career") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("startup-kit");
  }
}
