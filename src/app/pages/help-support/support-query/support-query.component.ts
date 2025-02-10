import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SelectModule } from "primeng/select";
@Component({
  selector: "uni-support-query",
  templateUrl: "./support-query.component.html",
  styleUrls: ["./support-query.component.scss"],
  standalone: true,
  imports: [CommonModule,  SelectModule],

})
export class SupportQueryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
