import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SopRoutingModule } from './sop-routing.module';
import {SopComponent} from "./sop.component";
import { CountryComponent } from './country/country.component';
import {AvatarModule} from "primeng/avatar";
import {SharedComponents} from "../../@shared/components";
import {FormsModule} from "@angular/forms";
import {UploadComponent} from "./upload/upload.component";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from 'primeng/multiselect';
import {CarouselModule} from 'primeng/carousel';
import {DialogModule} from "primeng/dialog";
import { GetDocumentsComponent } from './get-documents/get-documents.component';
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {StoreModule} from "@ngrx/store";
import {sopFeatureKey} from "./store/selectors";
import {sopReducer} from "./store/reducer";
import {EffectsModule} from "@ngrx/effects";
import {SopEffects} from "./store/effects";
import {PipesModule} from "@pipes/pipes.module";
import {AnalysisComponent} from "./analysis/analysis.component";
import {SharedDirectives} from "../../@shared/directives/common-d";
import {EditorModule} from "primeng/editor";
import {VerifyComponent} from "./verify/verify.component";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SopCanDeactivateGuard} from "../../guards/sop-can-deactivate.guard";

@NgModule({
  declarations: [SopComponent, CountryComponent, UploadComponent, GetDocumentsComponent, AnalysisComponent, VerifyComponent],
  imports: [
    CommonModule,
    SopRoutingModule,
    AvatarModule,
    SharedComponents,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CarouselModule,
    DialogModule,
    ToastModule,
    PipesModule,
    SharedDirectives,
    EditorModule,
    StoreModule.forFeature(sopFeatureKey, sopReducer),
    EffectsModule.forFeature([SopEffects]),
    ConfirmDialogModule
  ]
  ,
  providers: [MessageService, ConfirmationService, SopCanDeactivateGuard]
})
export class SopModule { }
