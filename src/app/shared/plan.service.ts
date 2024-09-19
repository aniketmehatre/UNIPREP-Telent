import {ChangeDetectorRef, Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthService} from "../Auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(private authService: AuthService) {}

  checkPlanIsExpired(): Observable<boolean> {
    return this.authService.getNewUserTimeLeft().pipe(
        map((res) => {
          let data = res.time_left;
          return data.plan === 'expired' || data.plan === 'subscription_expired';
        })
    );
  }
}