import { Component, HostListener, NgModule, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
	selector: "uni-support",
	templateUrl: "./support.component.html",
	styleUrls: ["./support.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterLink],
})
export class SupportComponent implements OnInit {
	ngOnInit(): void {}
}
