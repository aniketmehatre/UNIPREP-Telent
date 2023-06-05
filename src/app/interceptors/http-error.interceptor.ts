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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
      private toastr: MessageService,
      private ngxService: NgxUiLoaderService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      if(!request.url.includes('getchathistory')){
          this.ngxService.start();
      }
    return next.handle(request).pipe(
        tap((res: any) => {
            if (res.status) {
                this.ngxService.stop();
            }
        }),
      catchError((err: any) => {
        console.log(">>",err);
        const msg = err?.error?.message || err?.error?.error?.message || 'Something wrong please try again!';
          this.toastr.add({severity: 'error', summary: 'Error', detail: msg});
          this.ngxService.stop();
        return throwError(() => new Error(msg));
      })
    );
  }
}
