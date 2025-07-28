import { Injectable } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {

  premiumPlanMenu: string[] = ['Career Tools', 'Travel Tools', 'Education Tools', 'Founders Tool'];
  public hasUserSubscriptionNew$ = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) { }

  isInvalidSubscriptionNew(module: string): boolean {
    let planExpired: boolean = false;
    if (this.authService._userSubscrition?.time_left?.plan === "expired" ||
      this.authService._userSubscrition?.time_left?.plan === "subscription_expired") {
      planExpired = true;
    }
    return planExpired;
  }

  isInvalidSubscription(module: string): boolean {
    let planExpired: boolean = false;
    //|| module === 'ai_credit_count' 
    if (module === 'ai_global_advisor' || module === 'education_tools' || module === 'travel_tools' || module === 'events'
      || module === 'global_repository' || module === 'uni_scholar' || module === 'uni_finder' || module === 'uni_learn'
      || module === 'language_hub'
    ) {
      if (this.authService._userSubscrition?.time_left?.plan === "expired" ||
        this.authService._userSubscrition?.time_left?.plan === "subscription_expired") {
        planExpired = true;
      }
    }
    else if (
      module === 'career_tools' ||
      // module === 'employer_connect' ||
      module === 'learning_hub' ||
      module === 'pitch_desk'
    ) {
      if (this.authService._userSubscrition?.time_left?.plan === "expired" ||
        this.authService._userSubscrition?.time_left?.plan === "subscription_expired" ||
        this.authService._userSubscrition?.subscription_details?.subscription_plan === "Student") {
        planExpired = true;
      }
    }
    else if (module === 'founders_tools') {
      if (this.authService._userSubscrition?.time_left?.plan === "expired" ||
        this.authService._userSubscrition?.time_left?.plan === "subscription_expired" ||
        this.authService._userSubscrition?.subscription_details?.subscription_plan === "Student" ||
        this.authService._userSubscrition?.subscription_details?.subscription_plan === "Career") {
        planExpired = true;
      }
    }
    return planExpired;
  }
}
