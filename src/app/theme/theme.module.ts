import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { PipesModule } from './pipes/pipes.module';
import { SideMenuComponent } from './components/sidenav/side-menu/side-menu.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { CountdownComponent } from 'ngx-countdown';
import { CountdownModule } from 'ngx-countdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextarea } from 'primeng/inputtextarea';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TabViewModule } from 'primeng/tabview';

import { DropdownModule } from "primeng/dropdown";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { HeaderSearchComponent } from "../pages/header-search/header-search.component";
import { HeaderSearchModuleComponent } from "../pages/header-search-module/header-search-module.component";

@NgModule({
  imports: [
    CommonModule,
    SideMenuComponent,
    SidenavComponent,
    PipesModule,
    BreadcrumbModule,
    CardModule,
    EditorModule,
    AvatarModule,
    CountdownModule,
    ButtonModule,
    FormsModule,
    InputTextarea,
    PopoverModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    NgxIntlTelInputModule,
    TabViewModule
  ],
  exports: [
    CommonModule,
    PipesModule,
    SidenavComponent, 
    CountdownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThemeModule {}
