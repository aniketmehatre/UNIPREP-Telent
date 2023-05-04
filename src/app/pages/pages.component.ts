import {Component, HostListener, OnDestroy, OnInit, Output} from "@angular/core";
import {PageFacadeService} from "./page-facade.service";
import {SubSink} from "subsink";

@Component({
    selector: "uni-pages",
    templateUrl: "./pages.component.html",
    styleUrls: ["./pages.component.scss"],
})
export class PagesComponent implements OnInit, OnDestroy {
    sidebarClass = "";
    stickHeader = false;
    @Output() expandicon = !this.sidebarClass
        ? "pi-align-right"
        : "pi-align-justify";
    private subs = new SubSink();

    constructor(private pageFacade: PageFacadeService) {
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    ngOnInit(): void {
        this.subs.sink = this.pageFacade.sideBarState$().subscribe({
            next: (state) => {
                this.sidebarClass = state ? "active" : "";
            },
        });
    }

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
        if (event.target.innerWidth > 765 && this.sidebarClass) {
            this.pageFacade.togleSideBar(true);
        }
    }

    onWindowScroll(event: any) {
        if (event.srcElement.scrollTop < 70) {
            this.stickHeader = false;
        } else {
            this.stickHeader = true;
        }
    }

    togleSidebar() {
        this.pageFacade.togleSideBar(!this.sidebarClass);
    }
}
