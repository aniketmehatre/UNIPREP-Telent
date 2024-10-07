import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "uni-learn",
  templateUrl: "./unilearn.component.html",
  styleUrls: ["./unilearn.component.scss"],
})
export class UniLearnComponent implements OnInit {
  constructor() {}
  stage = 1;
  @Input() parentid:number;
  @Input() moduleid:number;
  @Input() selected_module: string;
  ngOnInit(): void {
  }
  moduleChange(data: any) {
    this.parentid=data.parent_id;
    this.moduleid=data.module_id;
    this.selected_module=data.selected_module
    this.stage = data.stage;
  }
}
