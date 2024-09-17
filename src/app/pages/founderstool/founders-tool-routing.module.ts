import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FounderstoolComponent } from './founderstool.component';
import { FoundersacademyComponent } from './foundersacademy/foundersacademy.component';
import { FounderstoollistComponent } from './founderstoollist/founderstoollist.component';

const routes: Routes = [
  {
    path: '', component: FounderstoolComponent,
    children: [
        {
        path:'foundersacademy',component:FoundersacademyComponent
        },
        {
            path:'founderstoollist',component:FounderstoollistComponent
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class foundersToolRountingModule { }