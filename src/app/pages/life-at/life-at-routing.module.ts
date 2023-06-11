import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LifeAtComponent} from "./life-at.component";
import {ListModulesComponent} from "./list-modules/list-modules.component";

const routes: Routes = [{
    path: '', component: LifeAtComponent,
    children: [
        {
            path: 'sub-modules', component: ListModulesComponent,
        },
        {
            path: 'sub-modules/:id', component: ListModulesComponent,
        },
        {path: '', redirectTo: 'sub-modules', pathMatch: 'full'}
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LifeAtRoutingModule {
}
