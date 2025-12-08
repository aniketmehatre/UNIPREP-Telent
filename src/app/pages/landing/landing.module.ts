import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LandingComponent } from "./landing.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { ScrollTop, ScrollTopModule } from "primeng/scrolltop";
import { JobSeekersLandingComponent } from "./job-seekers-landing/job-seekers-landing.component";
import { LandingLanguageHubComponent } from "./landing-language-hub/landing-language-hub.component";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/Auth/auth.service";
import { LandingFooterComponent } from "./landing-footer/landing-footer.component";
import { landingRoutes } from "./landing.routes";
import { UuidInviteCardComponent } from "./landing-content/uuid-invite-card/uuid-invite-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule.forChild(landingRoutes),
    ScrollTopModule,
    LandingLanguageHubComponent,
    JobSeekersLandingComponent,
    UuidInviteCardComponent,
    // Empty reducer configuration or actual reducers here
    LandingFooterComponent,
  ],
  declarations: [LandingComponent],
  providers: [MessageService, AuthService],
})
export class LandingModule {}
