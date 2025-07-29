import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface HowItWorks{
  visible: boolean;
  moduleName: string;
}
@Injectable({
  providedIn: 'root'
})
export class HowItWorksService {
  public howItWorksModule$ = new BehaviorSubject<HowItWorks>({visible: false, moduleName: ''});

  open(moduleName: string){
    this.howItWorksModule$.next({ visible: true, moduleName });
  }

  // close(){
  //   this.howItWorksModule$.next({ visible: false, moduleName: ''});
  // }
}
