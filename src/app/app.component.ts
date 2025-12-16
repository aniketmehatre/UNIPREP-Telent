import { Component, inject, OnInit, signal } from "@angular/core";
import { LocationService } from "./services/location.service";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ToastModule } from "primeng/toast";
import { Router, RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { SocialShareService } from "./services/social-share.service";
import { ScrollTopModule } from "primeng/scrolltop";
import { BrandColorService } from "./services/brand-color.service";

@Component({
  selector: "app-root",
  template: ` <router-outlet></router-outlet>
    <p-scrolltop
      class="position-absolute"
      [threshold]="100"
      icon="pi pi-arrow-up"
      [buttonProps]="{ raised: true, rounded: true }"
    ></p-scrolltop>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader
      overlayColor="rgba(0,0,0,0.8)"
      logoUrl="uniprep-assets/images/icon-loader.svg"
      [bgsSize]="40"
      bgsType="three-bounce"
      [bgsOpacity]="1"
      bgsColor="var(--p-secondary-500)"
      fgsOpacity="1"
      fgsColor="var(--p-secondary-500)"
      [hasProgressBar]="false"
    ></ngx-ui-loader>`,
  standalone: true,
  imports: [NgxUiLoaderModule, ToastModule, RouterModule, ScrollTopModule],
  providers: [MessageService, SocialShareService],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private brandColorService = inject(BrandColorService);
  private locationService = inject(LocationService);
  private isInstitute = signal(false);

  isPageHidden = false;

  ngOnInit() {
    // Apply palettes from localStorage on app startup
    this.brandColorService.applyPalettesFromLocalStorage();
    this.apiToCheckPartnerOrInstitute();
    if (this.isInstitute()) {
      if (window.location.href.includes("/register")) {
        this.router.navigate(["/login"], { replaceUrl: true });
      }
    }
    document.addEventListener("visibilitychange", () => {
      this.isPageHidden = document.hidden;
    });
  }

  apiToCheckPartnerOrInstitute() {
    this.locationService
      .getSourceByDomain(window.location.hostname)
      .subscribe((response) => {
        if (response.source == "Institute") {
          this.isInstitute.set(true);
        }
      });
  }
}
