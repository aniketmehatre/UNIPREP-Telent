import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { RouterModule, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from "@angular/router";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";
import { appRoutes } from "./app.routes";
import { LandingComponent } from "./pages/landing/landing.component";
import { provideStore } from "@ngrx/store";
import { DeviceDetectorService } from "ngx-device-detector";
import { DatePipe } from "@angular/common";
import { AuthService } from "./Auth/auth.service";
import { EnterpriseSubscriptionService } from "./components/enterprise-subscription/enterprise-subscription.service";
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor";
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage";
import { ModalService } from "./components/modal/modal.service";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from "angularx-social-login";
import { pagesReducer } from "./pages/store/pages.reducer";
import { JwtModule } from "@auth0/angular-jwt";
import { tokenGetter } from "./app.module";
import { environment } from "@env/environment";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { CountdownModule } from "ngx-countdown";
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextarea } from "primeng/inputtextarea";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PipesModule } from "@pipes/pipes.module";
import { MetaModule } from "@ngx-meta/core";
import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from "./shared/shared.module";
import { NgChartsModule } from 'ng2-charts'; // Ensure compatibility with Angular 16
import { ToastModule } from "primeng/toast";

export const appConfig: ApplicationConfig = {
	providers: [
    {
      provide: MetaModule,
      useFactory: () => MetaModule.forRoot(),
    },
    {
      provide: JwtModule,
      useFactory: () =>
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: [environment.domain],
            disallowedRoutes: [],
          },
        }),
    },
		provideRouter(
			appRoutes,
			withInMemoryScrolling({
				anchorScrolling: "enabled",
				scrollPositionRestoration: "enabled",
			}),
			withEnabledBlockingInitialNavigation()
		),
		provideStore(pagesReducer),
		provideHttpClient(withFetch()),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: ".app-dark",
				},
			},
		}),
		// Other services
		LandingComponent,
		DeviceDetectorService,
		DatePipe,
		AuthService,
		EnterpriseSubscriptionService,
		ModalService,
		// Social Login Config
		{
			provide: "SocialAuthServiceConfig",
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider("32944187384-4jubeedmfdusvhk6n7ben61ce7u9ber8.apps.googleusercontent.com", {
							oneTapEnabled: false,
						}),
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider("892925195633254"),
					},
				],
			} as SocialAuthServiceConfig,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true,
		},
		{
			provide: NGX_LOCAL_STORAGE_CONFIG,
			useValue: NGX_LOCAL_STORAGE_CONFIG,
		},
		NgxUiLoaderModule,
		CountdownModule,
		AvatarModule,
		DropdownModule,
		ButtonModule,
		SkeletonModule,
		InputTextModule,
		ReactiveFormsModule,
		OverlayPanelModule,
		DialogModule,
		CardModule,
		FormsModule,
		TooltipModule,
		PipesModule,
		ConfirmDialogModule,
		ToastModule,
		PaginatorModule,
		SharedModule,
		NgChartsModule,
	],
};
