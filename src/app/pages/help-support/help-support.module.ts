import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupportDescriptionComponent } from "./support-description/support-description.component";
import { SupportQueryComponent } from "./support-query/support-query.component";
import { HelpSupportRoutingModule } from "./help-support-routing.module";
import { SupportCardComponent } from "./support-card/support-card.component";

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [CommonModule,SupportDescriptionComponent,SupportCardComponent, HelpSupportRoutingModule, SupportQueryComponent,  InputTextModule, ButtonModule],
})
export class HelpSupportModule {}
