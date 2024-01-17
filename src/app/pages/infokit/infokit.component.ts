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
  ],
  templateUrl: "./infokit.component.html",
  styleUrls: ["./infokit.component.scss"],
})
export class InfoKitComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: InformationService,
    private toastr: MessageService,
    private route: Router
  ) {}
  titletext = "INFORMATION KIT";
  folderdata: any = "0";
  routedata: any = [];
  parentfolderlists: any = [];
  ngOnInit(): void {
    this.getFolderData(this.folderdata);
  }
  getFolderData(parent_id: any) {
    this.service
      .GetFolderList({
        parent_id: parent_id,
      })
      .subscribe((res) => {
        this.parentfolderlists = res?.data;
      });
  }
  getchildinfo(data: any) {
    if (data.isFolder == "2") {
      return;
    }
    this.folderdata = data.id;
    if (data.parent_id == "0") {
      this.titletext = data.name;
    }
    this.routedata.push({
      id: data.id,
      name: data.name,
      data: data,
      path: "country",
    });
    this.getFolderData(this.folderdata);
  }
  actionedrouteData: any = [];
  redirectTo(path: any, arrayindex: number) {
    if (path.path == "country") {
      this.actionedrouteData = [];
      this.routedata.forEach((rdata: any, index: number) => {
        if (index <= arrayindex) {
          this.actionedrouteData.push(rdata);
        }
      });
      this.routedata = this.actionedrouteData;
      this.getFolderData(path.id);
    } else {
      if (path == "infokit") {
        this.routedata = [];
        this.getFolderData("0");
      }
      this.route.navigate(["pages/" + path]);
    }
  }
}
