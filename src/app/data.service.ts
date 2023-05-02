import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public chatTriggerSource = new BehaviorSubject('not open');
    currentMessage = this.chatTriggerSource.asObservable();

    public countryNameSource = new BehaviorSubject('United States');
    countryName = this.countryNameSource.asObservable();

    public countryIdSource = new BehaviorSubject('1');
    countryId = this.countryIdSource.asObservable();

    constructor() {
    }

    changeChatOpenStatus(message: string) {
        this.chatTriggerSource.next(message);
    }

    changeCountryName(countryName: string) {
        this.countryNameSource.next(countryName)
    }

    changeCountryId(countryId: string) {
        this.countryIdSource.next(countryId)
    }

}
