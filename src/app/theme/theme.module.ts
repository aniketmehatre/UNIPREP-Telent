import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { PipesModule } from '@pipes/pipes.module';
import { SideMenuComponent } from './components/sidenav/side-menu/side-menu.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {AvatarModule} from 'primeng/avatar';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, SideMenuComponent],
  imports: [
    CommonModule, PipesModule, BreadcrumbModule,
    AvatarModule
  ],
  exports: [HeaderComponent, SidenavComponent]
})
export class ThemeModule { }
