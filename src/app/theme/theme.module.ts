import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SideMenuComponent } from './components/sidenav/side-menu/side-menu.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { CountdownComponent } from 'ngx-countdown';
import { CountdownModule } from 'ngx-countdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TabsModule } from 'primeng/tabs';

@NgModule({
  imports: [
    CommonModule,
    SideMenuComponent,
    SidenavComponent,
    BreadcrumbModule,
    CardModule,
    EditorModule,
    AvatarModule,
    CountdownModule,
    ButtonModule,
    FormsModule,
    TextareaModule,
    PopoverModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    NgxIntlTelInputModule,
    TabsModule
  ],
  exports: [
    CommonModule,
    SidenavComponent, 
    CountdownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThemeModule {}
