import { Component, Input, OnInit } from "@angular/core";
import {ArrayHeaderService} from "./array-header.service";

@Component({
  selector: "uni-learn",
  templateUrl: "./unilearn.component.html",
  styleUrls: ["./unilearn.component.scss"],
})
export class UniLearnComponent implements OnInit {
  constructor(private arrayHeaderService: ArrayHeaderService) {}
  stage = 1;
  @Input() parentid:number;
  @Input() moduleid:number;  
  @Input() totalquestion: number;
  @Input() selected_module: string;
  @Input() _contentalignment:boolean;
  ngOnInit(): void {
  }
  moduleChange(data: any) {
    // this.arrayHeaderService.addItem(data.selected_module)
    if (data.isfromquizinfo){
      this._contentalignment=true;
    }
    else{
      this._contentalignment=false;
    }
    this.parentid=data.parent_id;
    this.moduleid=data.module_id;
    this.selected_module=data.selected_module
    this.totalquestion=data.totalquestion
    this.stage = data.stage;
  }
}
