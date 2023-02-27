import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SopListComponent } from './sop-list/sop-list.component';
import { SopSampleSubcatgoryComponent } from './sop-sample-subcatgory/sop-sample-subcatgory.component';
import { SopSampleComponent } from './sop-sample.component';
import { SopsampleCategoryComponent } from './sopsample-category/sopsample-category.component';
import { SopsampleContentComponent } from './sopsample-content/sopsample-content.component';

const routes: Routes = [
    {
      path: '', component: SopSampleComponent,
      children:[
        {
          path: 'category', component: SopsampleCategoryComponent,
          
          
        },
        {
          path: 'subcategory/:url', component:SopSampleSubcatgoryComponent
          
          
        },
      {
        path: 'SopList/:url', component: SopListComponent,
        
        
      },
      {
        path: 'displayPDF/:url', component: SopsampleContentComponent,
        
        
      },
      { path: '', redirectTo: 'category', pathMatch: 'full'}
    ]
      
      
    },
]
// const routes: Routes = [
//   {
//     path: '', component: SopSampleComponent,
    
    
//   },
//   {
//     path: 'sopsamplestopic/:url', component: SopSampleSubcatgoryComponent,
//     // children:[
//     //   {
//     //     path: 'SopList/:url', component: SopListComponent,
        
        
//     //   },
//     //   {
//     //     path: 'displayPDF/:url', component: SopsampleContentComponent,
        
        
//     //   },
//     // ]
    
//   },
//   {
//         path: 'SopList/:url', component: SopListComponent,
        
        
//       },
//         {
//         path: 'displayPDF/:url', component: SopsampleContentComponent,
        
        
//       },
  

// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SopSampleRoutingModule { }
