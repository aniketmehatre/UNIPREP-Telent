import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./components/header/header.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { PipesModule } from "@pipes/pipes.module";
import { SideMenuComponent } from "./components/sidenav/side-menu/side-menu.component";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { AvatarModule } from "primeng/avatar";
import { CountdownComponent } from "ngx-countdown";
import { CountdownModule } from "ngx-countdown";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { EditorModule } from "primeng/editor";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { TabViewModule } from "primeng/tabview";
import { HeaderSearchComponent } from "../pages/header-search/header-search.component";
import { HeaderSearchModuleComponent } from "../pages/header-search-module/header-search-module.component";

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, SideMenuComponent,HeaderSearchComponent, HeaderSearchModuleComponent],
  imports: [
    CommonModule,
    PipesModule,
    BreadcrumbModule,
    CardModule,
    EditorModule,
    AvatarModule,
    CountdownModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    InputTextareaModule,
    OverlayPanelModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    NgxIntlTelInputModule,
    TabViewModule,
  ],
  exports: [HeaderComponent, SidenavComponent, CountdownComponent,HeaderSearchComponent,  HeaderSearchModuleComponent],
})
export class ThemeModule {}
