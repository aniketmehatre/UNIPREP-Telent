import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayHeaderService } from "./array-header.service";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { RouterModule } from "@angular/router";
@Component({
  selector: 'uni-learn',
  templateUrl: './unilearn.component.html',
  standalone: true,
  imports: [CommonModule, SkeletonModule, TooltipModule, RouterModule]
})

export class UniLearnComponent {
  constructor(private arrayHeaderService: ArrayHeaderService) {}
  stage = 1;
  parentid: number;
  moduleid: number;
  totalquestion: number;
  selected_module: string;
  _contentalignment: boolean;
  moduleChange(data: any) {
    if (data.isfromquizinfo) {
      this._contentalignment = true;
    } else {
      this._contentalignment = false;
    }
    this.parentid = data.parent_id;
    this.moduleid = data.module_id;
    this.selected_module = data.selected_module;
    this.totalquestion = data.totalquestion;
    this.stage = data.stage;
  }
}
