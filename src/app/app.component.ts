import {Component, OnInit} from "@angular/core";
import {LocationService} from "./location.service";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {ToastModule} from "primeng/toast";
import {Router, RouterModule} from "@angular/router";
import {MessageService} from "primeng/api";
import {SeoManagerComponent} from "./components/seo-manager/seo-manager.component";
import {SocialShareService} from "./shared/social-share.service";
import {ScrollTopModule} from "primeng/scrolltop";

@Component({
    selector: "app-root",
    template: `
        <app-seo-manager></app-seo-manager>
        <router-outlet></router-outlet>
        <p-scrolltop class="position-absolute" [threshold]="100" icon="pi pi-arrow-up"
                     [buttonProps]="{ raised: true, rounded: true }"></p-scrolltop>
        <p-toast position="top-right"></p-toast>
        <ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/icon-loader.svg" [bgsSize]="40"
                       bgsType="three-bounce" [bgsOpacity]="1" bgsColor="#f0780e" fgsOpacity="1" fgsColor="#f0780e"
                       [hasProgressBar]="false"></ngx-ui-loader>`,
    standalone: true,
    imports: [NgxUiLoaderModule, ToastModule, RouterModule, ScrollTopModule, SeoManagerComponent],
    providers: [MessageService, SocialShareService],
})
export class AppComponent implements OnInit {
    constructor(private whiteLabelService: LocationService, private router: Router) {
    }

    isPageHidden = false;
    domainNameCondition: string
    domainName: string = "main"
    whiteLabelDomainName: any


    ngOnInit() {
        this.domainNameCondition = window.location.hostname;
        this.domainName = this.isDomainMain() ? "main" : "sub";
        if (this.domainName === "sub") {
            this.router.navigate(["/main"], {replaceUrl: true});
        }
        this.getImageWhitelabel();
        document.addEventListener("visibilitychange", () => {
            this.isPageHidden = document.hidden;
        });
    }

    private isDomainMain(): boolean {
        return this.domainNameCondition === "dev-institutes.uniprep.ai" ||
            this.domainNameCondition === "institutes.uniprep.ai" || this.domainNameCondition === "partners.uniprep.ai"
            || this.domainNameCondition === "talent.uniprep.ai"
            || this.domainNameCondition === "dev-student.uniprep.ai" ||
            this.domainNameCondition === "*.uniprep.ai" || this.domainNameCondition === "uniprep.ai" ||
            this.domainNameCondition === "localhost";
    }


    getImageWhitelabel() {
        this.whiteLabelDomainName = window.location.hostname;
        let data = {
            domainname: this.whiteLabelDomainName,
        };
        this.whiteLabelService.getWhitlabelData(data).subscribe((res) => {
        });
    }
}
