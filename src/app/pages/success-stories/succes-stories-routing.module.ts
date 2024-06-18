import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SuccessStoriesComponent } from './success-stories.component';

const routes: Routes = [
    {path: '', component: SuccessStoriesComponent}  
];

@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
})
export class SuccessStoryRoutingModule {
}
