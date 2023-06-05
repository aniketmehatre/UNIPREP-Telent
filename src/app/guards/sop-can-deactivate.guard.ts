import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {SopComponent} from "../pages/sop/sop.component";

@Injectable({
  providedIn: 'root'
})
export class SopCanDeactivateGuard implements CanDeactivate<SopComponent> {

  canDeactivate(component: SopComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate()  || Observable.create((observer: any) => {
      component.confirmationService.confirm({
        header: 'Confirm!',
        message: `Press Cancel to go back and save these changes, or OK to lose these changes.`,
        icon: 'fa fa-exclamation-triangle',
        reject: () => { observer.next(false);  observer.complete(); },
        accept: () => { observer.next(true);  observer.complete(); }
      })

    })
  }
}
