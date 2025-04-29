import { RouterModule, Routes } from "@angular/router";
import { UniLearnComponent } from "./unilearn.component";
import { NgModule } from "@angular/core";
import { LearnsubModulesComponent } from "./learnsubmodules/learnsubmodules.component";
import { LearnModulesComponent } from "./learnmodules/learnmodules.component";
import { TestModulesComponent } from "./testmodule/testmodule.component";

const routes: Routes = [
    {
        path: '', component: UniLearnComponent,
        children: [
            {
                path: 'modules', component: LearnModulesComponent,
            },
            {
                path: 'submodules', component: LearnsubModulesComponent,
            },
            {
                path: '', redirectTo: 'languages', pathMatch: 'full'
            },
        ]
    }];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UniLearnRoutingModule {}
