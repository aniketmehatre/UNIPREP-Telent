import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { RouterModule } from "@angular/router"
@Component({
	selector: "uni-help-support",
	templateUrl: "./help-support.component.html",
	styleUrls: ["./help-support.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule],
})
export class HelpSupportComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
