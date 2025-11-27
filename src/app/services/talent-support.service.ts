import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocationData } from "../@Models/location.model";
import { DeviceDetectorService } from "ngx-device-detector";
import { LocalStorageService } from "ngx-localstorage";
import { BehaviorSubject, Observable, of, shareReplay, tap } from "rxjs";
import { educationLevel } from "../@Models/module.model";
import { Blog } from "../pages/landing/bloglist/bloglist.component";
import { DropdownListData } from "../@Models/talent-support.model";

export interface WorkLocations {
  worklocations: worklocation[];
}
export interface worklocation {
  id: number;
  work_location: string;
}

@Injectable({
  providedIn: "root",
})
export class TalentSupportService {
  headers = new HttpHeaders().set("Accept", "application/json");

  private apiUrlCurrencyConversion =
    "https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries";
  // private headers = new HttpHeaders({
  //   "x-rapidapi-host": "currency-conversion-and-exchange-rates.p.rapidapi.com",
  //   "x-rapidapi-key": "d08adbb963msh135bd172e57612cp19ee92jsna8b68088b175",
  // });

  constructor(
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private storage: LocalStorageService
  ) {}

  getPositionTitleData(data: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrlEmployer + "/searchPositions",
      data
    );
  }
  getWorkLocationDropdownData(): Observable<WorkLocations> {
    return this.http.get<WorkLocations>(
      environment.ApiUrlEmployer + "/easyappyworklocations"
    );
  }

  talentSupportPayLink(req: any) {
    return this.http.post(
      `${environment.ApiUrl}/talent-support-transaction-request`,
      req
    );
  }

  talentSupportCompleteTransaction(req: any) {
    return this.http.post(
      `${environment.ApiUrl}/talent-support-complete-transaction`,
      req
    );
  }

  getDropdownData(): Observable<DropdownListData> {
    return this.http.get<DropdownListData>(
      environment.ApiUrlEmployer + "/easyappydropdownlist"
    );
  }

  createPositionTitle(paramData: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrlEmployer + "/addpositiontitle",
      paramData
    );
  }

  getStudentProfilesDropDownList() {
    return this.http.get<any>(
      environment.ApiUrlEmployer + "/getyourprofiledropdownvalues"
    );
  }

   getTalentSupportHistory(data: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/talent-support-history`,
      data
    );
  }
}
