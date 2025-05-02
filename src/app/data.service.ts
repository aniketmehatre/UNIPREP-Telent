import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LocationService } from "./location.service";
import {StorageService} from "./storage.service";

@Injectable({
    providedIn: "root",
})
export class DataService {


    public chatTriggerSource = new BehaviorSubject("not open");
    currentMessage = this.chatTriggerSource.asObservable();

    public countryNameSource = new BehaviorSubject('');
    countryName = this.countryNameSource.asObservable();

    public countryIdSource = new BehaviorSubject(Number(this.storage.get('countryId')) ? '' : '');
    countryId = this.countryIdSource.asObservable();

    public countryFlagSource = new BehaviorSubject('');
    countryFlag = this.countryFlagSource.asObservable();



    public homeCountryFlagSource = new BehaviorSubject('');
    homeCountryFlag = this.homeCountryFlagSource.asObservable();

    public timeoutStatusSource = new BehaviorSubject(0);
    timeoutStatus = this.timeoutStatusSource.asObservable();

    public showTimeOutSource = new BehaviorSubject(false);
    showTimeOutStatus = this.showTimeOutSource.asObservable();

    public openReportWindowSource = new BehaviorSubject<any>("");
    openReport = this.openReportWindowSource.asObservable();

    public showTimerSource = new BehaviorSubject<any>(null);
    showTimer = this.showTimerSource.asObservable();

    public showFeedBackSource = new BehaviorSubject<any>(false);
    showFeedback = this.showFeedBackSource.asObservable();

    public showTimeOutSourceData = new BehaviorSubject(true);
    showTimeOutStatusData = this.showTimeOutSourceData.asObservable();

    public showLoggedInAnotherDevice = new BehaviorSubject('none');
    showLoggedInAnotherDeviceData = this.showLoggedInAnotherDevice.asObservable();

    public booleanValue = new BehaviorSubject<any>(true);
    castValue = this.booleanValue.asObservable();


    private jobSearchDataSource = new BehaviorSubject<any>({});
    currentData = this.jobSearchDataSource.asObservable();

    private triggerManualJobAdd = new BehaviorSubject<any>(false);
    manualJobAdd = this.triggerManualJobAdd.asObservable();


    constructor(private locationService: LocationService, private storage: StorageService,) {
    }


    changeManualAdd(data: any) {
        this.triggerManualJobAdd.next(data);
    }


    changeData(data: any) {
        this.jobSearchDataSource.next(data);
    }


    changeCountryName(countryName: string) {
        this.countryNameSource.next(countryName);
    }

    changeCountryFlag(countryFlag: string) {
        if(countryFlag){
            this.countryFlagSource.next(countryFlag);
        }else{
            this.countryFlagSource.next('/uniprep-assets/image-available.jpg')
        }
    }

    changeHomeCountryFlag(countryFlag: string) {
        if(countryFlag){
            this.homeCountryFlagSource.next(countryFlag);
        }else{
            this.homeCountryFlagSource.next('/uniprep-assets/image-available.jpg')
        }
    }

    changeCountryId(countryId: string) {
        let countryInfo = {
            selected_country: countryId
        }
        this.locationService.UpdateSelectedCountry(countryInfo).subscribe(data => {
            //this.countryFlagSource.next(data.flag);
            this.countryNameSource.next(data.name);
            this.countryIdSource.next(countryId);
        })
    }

    changeTimeOutStatus(isValid: number) {
        this.timeoutStatusSource.next(isValid);
    }

    showTimeOut(isShow: boolean) {
        this.showTimeOutSource.next(isShow);
    }

    openReportWindow(data: any) {
        console.log(data)
        this.openReportWindowSource.next(data);
    }

    showFeedBackPopup(data: any) {
        this.showFeedBackSource.next(data);
    }

    showPopup(data: any) {
        this.showTimeOutSourceData.next(data);
    }

    loggedInAnotherDevice(data: any) {
        this.showLoggedInAnotherDevice.next(data);
    }

    sendValue(newValue: boolean) {
        this.booleanValue.next(newValue);
    }

    countDownFun: any

    showTimerInHeader(data: any) {
        const now = new Date();
        const next = this.AddMinutesToDate(now, 86400);
        const countDownDate = next.getTime();
        clearInterval(this.countDownFun);
        this.countDownFun = setInterval(() => {
            let now = new Date().getTime();

            // Find the distance between now an the count down date
            let distance = countDownDate - now;
            // this.storage.set('remaining_time', String(5183989985));
            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"

            this.showTimerSource.next(
                days + "-" + hours + "-" + minutes + "-" + seconds
            );
            // If the countdown is over, write some text
            if (distance < 0) {
                clearInterval(this.countDownFun);
                this.showTimerSource.next("EXPIRED");
            }
        }, 1000);
    }

    AddMinutesToDate(date: any, minutes: any) {
        return new Date(date.getTime() + minutes * 60000);
    }

    private jobGroupButtonHandled = new BehaviorSubject<any>(null);
    jobGroupButtonHandled$: Observable<any> = this.jobGroupButtonHandled.asObservable();
    setJobGroupButtonHandled(data: any): void {
        this.jobGroupButtonHandled.next(data);
    }


}
