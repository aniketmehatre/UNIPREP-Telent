import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../Auth/auth.service';
import {DataService} from '../data.service';

@Injectable({
    providedIn: 'root'
})
export class PagesGuard implements CanActivate {

    isValid: boolean = false;

    constructor(private auth: AuthService, private data: DataService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        this.data.timeoutStatusSource.subscribe(data => {
            if (data <= 0) {
                this.data.showTimeOut(true);
                this.isValid = false;
            } else {
                this.isValid = true;
            }
        })

        return this.isValid;
    }
}
