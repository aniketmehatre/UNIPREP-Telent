import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { ScrollTopModule } from 'primeng/scrolltop';
import { pagesReducer } from './pages/store/pages.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { EffectsModule } from '@ngrx/effects';
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor";
import { NGX_LOCAL_STORAGE_CONFIG, NgxLocalstorageConfiguration } from "ngx-localstorage";
import { ToastModule } from "primeng/toast";
import { JwtModule } from "@auth0/angular-jwt";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { CountdownModule } from 'ngx-countdown';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PipesModule } from "@pipes/pipes.module";
import { LandingComponent } from './pages/landing/landing.component';
import { BlogdetailComponent } from './pages/blogdetail/blogdetail.component';
import { BloglistComponent } from './pages/bloglist/bloglist.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { FacebookLoginProvider } from "angularx-social-login";
import { MetaModule } from "@ngx-meta/core";
import { EnterpriseSubscriptionService } from './components/enterprise-subscription/enterprise-subscription.service';
import { EnterpriseSubscriptionComponent } from './components/enterprise-subscription/enterprise-subscription.component';
import { DeviceDetectorService } from "ngx-device-detector";
import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from "./shared/shared.module";
import { ChartsModule } from 'ng2-charts'; // Ensure compatibility with Angular 16
import { AuthModule } from './Auth/auth.module';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
const ngxLocalstorageConfiguration: NgxLocalstorageConfiguration = {
  delimiter: '@',
  prefix: 'sop@'
};

export function tokenGetter() {
  return localStorage.getItem(`${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`)?.replace(/"/g, '') || '';
}

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ModalComponent,
    ScrollToBottomDirective,
    PrivacyComponent,
    EnterpriseSubscriptionComponent,
    BlogdetailComponent,
    BloglistComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    ScrollTopModule,
    MessageModule,
    MessagesModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot({ pages: pagesReducer }),
    AuthModule,
    HttpClientModule,
    ToastModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
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
    ConfirmDialogModule,
    ToastModule,
    PaginatorModule,
    SocialLoginModule,
    MetaModule.forRoot(),
    SharedModule,
    SkeletonModule,
    RouterModule,
    ChartsModule
  ],
  providers: [
    DeviceDetectorService,
    DatePipe,
    AuthService,
    EnterpriseSubscriptionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: NGX_LOCAL_STORAGE_CONFIG,
      useValue: ngxLocalstorageConfiguration
    },
    ModalService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('32944187384-4jubeedmfdusvhk6n7ben61ce7u9ber8.apps.googleusercontent.com', {
              oneTapEnabled: false,
            }),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('892925195633254'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
