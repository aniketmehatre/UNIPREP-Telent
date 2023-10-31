import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {MessageService} from "primeng/api";
import {NgxUiLoaderService} from "ngx-ui-loader";
import { Router } from '@angular/router';
import { log } from 'console';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
      private toastr: MessageService,
      private ngxService: NgxUiLoaderService,
      private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      if(!request.url.includes('getchathistory') || !request.url.includes('getdashboardcount') || !request.url.includes('getmodulereadprogression')
      || !request.url.includes('country') || !request.url.includes('getuserdetails') || !request.url.includes('GetTrusterPatners')){
          this.ngxService.start();
      }
    return next.handle(request).pipe(
        tap((res: any) => {
            if (res.status) {
                this.ngxService.stop();
            }
        }),
      catchError((err: any) => {
        if(err.error.message.includes('Call to a member function tokens() on null')){
          window.sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl("/login");
        }
        const msg = err?.error?.message || err?.error?.error?.message || 'Something wrong please try again!';
          this.toastr.add({severity: 'error', summary: 'Error', detail: msg});
          this.ngxService.stop();
        return throwError(() => new Error(msg));
      })
    );
  }
}
