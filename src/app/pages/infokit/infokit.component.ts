import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Accordion, AccordionModule } from "primeng/accordion";
import { InformationService } from "./information.service";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { Router } from "@angular/router";
import { AuthService } from "src/app/Auth/auth.service";
import { PaginatorModule } from "primeng/paginator";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "uni-infokit",
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    TabViewModule,
    TableModule,
    AccordionModule,
    DropdownModule,
    ReactiveFormsModule,
    MultiSelectModule,
    PaginatorModule,
    TooltipModule,
    DialogModule,

  ],
  templateUrl: "./infokit.component.html",
  styleUrls: ["./infokit.component.scss"],
})
export class InfoKitComponent implements OnInit {
  planExpired!: boolean;
  restrict: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: InformationService,
    private toastr: MessageService,
    private route: Router,
    private authService: AuthService
  ) {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (
        data.plan === "expired" ||
        subscription_exists_status.subscription_plan === "free_trail" ||
        subscription_exists_status.subscription_plan === "Student" ||
        subscription_exists_status.subscription_plan === "Career" ||
        data.plan === 'subscription_expired'
      ) {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }
  titletext = "STARTUP KIT";
  folderdata: any = {};
  routedata: any = [];
  parentfolderlists: any = [];
  parentfilelists: any = []; totalcount = 0;
  ngOnInit() {
    this.folderdata = {
      parent_id: 0,
      page: 1,
      perpage: 10,
    };
    this.getFolderData();
  }
  getFolderData() {
    this.service
      .GetFolderList(this.folderdata)
      .subscribe((res) => {
        this.totalcount = res?.count;
        let responseData = res?.data;
        this.parentfolderlists = responseData.filter(
          (fdata: any) => fdata.isFolder == 1
        );
        this.parentfilelists = responseData.filter(
          (fdata: any) => fdata.isFolder == 2
        );
      });
  }
  pageChange(event: any) {
    this.folderdata.page = event.page + 1;
    this.folderdata.perpage = event.rows;
    this.getFolderData();
  }
  getchildinfo(data: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
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
      this.restrict = true;
      return;
    }
    window.open(url, "_blank");
  }

  upgradePlan(): void {
    this.route.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }
}
