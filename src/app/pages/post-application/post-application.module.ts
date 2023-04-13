import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostApplicationComponent } from './post-application.component';
import { ListSubModulesComponent } from './list-sub-modules/list-sub-modules.component';
import { PostApplicationRoutes } from './post-application.routing';

@NgModule({
  imports: [
    CommonModule,
    PostApplicationRoutes
  ],
  declarations: [PostApplicationComponent, ListSubModulesComponent]
})
export class PostApplicationModule { }
