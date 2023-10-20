import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { pagesReducer } from './pages/store/pages.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment';
import { AuthModule } from './Auth/auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { EffectsModule } from '@ngrx/effects';
import {HttpErrorInterceptor} from "./interceptors/http-error.interceptor";
import {NGX_LOCAL_STORAGE_CONFIG, NgxLocalstorageConfiguration} from "ngx-localstorage";
import {ToastModule} from "primeng/toast";
import {JwtModule} from "@auth0/angular-jwt";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { CountdownModule } from 'ngx-countdown';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';
import {AvatarModule} from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';

import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DialogModule} from "primeng/dialog";
import {CardModule} from "primeng/card";
import {TooltipModule} from "primeng/tooltip";
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SafePipe} from "@pipes/safe.pipe";
import {PipesModule} from "@pipes/pipes.module";
import { LandingComponent } from './pages/landing/landing.component';
const reducers = {
  pageSelector: pagesReducer
}

const ngxLocalstorageConfiguration: NgxLocalstorageConfiguration = {
  delimiter: '@',
  prefix: 'sop@'
};

export function tokenGetter() {
  return localStorage.getItem(`${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`)?.replace(/"/g, '') || '';
}

@NgModule({
  declarations: [
    AppComponent,LandingComponent, ModalComponent, BlockCopyPasteDirective, ScrollToBottomDirective
  ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        PagesModule,
        StoreModule.forRoot(reducers, {}),
        AuthModule,
        HttpClientModule,
        ToastModule,
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        EffectsModule.forRoot([]),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [environment.domain],
                disallowedRoutes: [],
            },
        }),
        NgxUiLoaderModule,
        CountdownModule,
        AvatarModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        InputTextareaModule,
        OverlayPanelModule,
        DialogModule,
        CardModule,
        FormsModule,
        TooltipModule,
        PipesModule,
        ConfirmDialogModule
    ],
  providers: [
    DatePipe,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: NGX_LOCAL_STORAGE_CONFIG,
      useValue: ngxLocalstorageConfiguration
    },
    ModalService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
