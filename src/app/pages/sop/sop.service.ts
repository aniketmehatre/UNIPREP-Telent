import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import { BehaviorSubject} from "rxjs";
import {Store} from "@ngrx/store";
import {SopState} from "./store/reducer";
import {
  checkPlag, gotoDownload,
  loadCountries,
  loadCourse,
  loadUnivercityByCountry,
  onSelectCourses,
  onSelectUnivercity, selectOptions, setPlagDoc, updateDoc,
  uploadDoc, verifyPlag
} from "./store/actions";
import {
  selectCountries$,
  selectCountryUnivercity$,
  selectCourses$,
  selectIsAnalyseBtnEnabaled$, selectPlag$, selectVerifyPageData$,
  selectUploadedDoc$, selectVerified$, selectDocId$, selectStage$, selectDocument$
} from "./store/selectors";

@Injectable({
  providedIn: "root",
})
export class SopService {
  _sopText = new BehaviorSubject<any>(null);
  _grammerText:any;
  _extractedresult:any
  constructor(
      private http: HttpClient,
      private store: Store<SopState>
  ) {}
  getDocId$() {
    return this.store.select(selectDocId$);
  }
  getStage$() {
    return this.store.select(selectStage$);
  }
  getDocument$() {
    return this.store.select(selectDocument$);
  }

  uploadDoc(data: {document: File}) {
    this.store.dispatch(uploadDoc(data));
  }
  updateDoc(data: string, docId: number) {
    this.store.dispatch(updateDoc({data, docId}));
  }
  setOptions() {
    this.store.dispatch(selectOptions());
  }

  uploadedDocdetails$() {
    return this.store.select(selectUploadedDoc$);
  }
  loadCourses() {
    this.store.dispatch(loadCourse());
  }
  courseList$() {
    return this.store.select(selectCourses$);
  }
  loadCountries() {
    this.store.dispatch(loadCountries());
  }
  countriesList$() {
    return this.store.select(selectCountries$);
  }
  loadUnivercityByCountry(countryId: number) {
    this.store.dispatch(loadUnivercityByCountry({id: countryId}));
  }
  univercityByCountryList$() {
    return this.store.select(selectCountryUnivercity$);
  }
  selectVerified$() {
    return this.store.select(selectVerified$);
  }
  selectVerifyPageData$() {
    return this.store.select(selectVerifyPageData$);
  }
  setPlagDoc(data: string) {
    this.store.dispatch(setPlagDoc({data}));
  }
  onSelectUnivercity(id: number) {
    this.store.dispatch(onSelectUnivercity({id}));
  }
  onSelectCourses(ids: []) {
    this.store.dispatch(onSelectCourses({ids}));
  }
  isAnalyseBtnEnabaled$() {
    return this.store.select(selectIsAnalyseBtnEnabaled$);
  }
  checkPlagFromData(data: string) {
    this.store.dispatch(checkPlag({data}));
  }
  plag$() {
    return this.store.select(selectPlag$);
  }
  verifyPlag() {
    this.store.dispatch(verifyPlag());
  }
  gotoDownload() {
    this.store.dispatch(gotoDownload());
  }
  Getcountries() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }

  GetCourses() {
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + localStorage.getItem("loginToken")
      );
    return this.http.get<any>(environment.ApiUrl + "/course", {
      headers: headers,
    });
  }
  GetUniversities() {
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + localStorage.getItem("loginToken")
      );
    return this.http.get<any>(environment.ApiUrl + "/university", {
      headers: headers,
    });
  }
  GetUniversitiesByCountryId(countryid:any) {
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + localStorage.getItem("loginToken")
      );
    return this.http.post<any>(environment.ApiUrl + "/universitybycountry",{country:countryid},{headers:headers});
  }
  getTextExtractionfromDoc(val:any){
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));

    const formData = new FormData();
    if(val.document!=null){
        formData.append("document",val.document,val.document.name)
   }
    return this.http.post<any>(environment.ApiUrl+'/readdoc',formData,{'headers': headers});
  
  }
  PlagarismCheck(val:any){
    // const formData = new FormData();
    //   formData.append("data",val)
    //   formData.append("key",environment.Plag_key)
    // return this.http.post<any>(environment.Sopurl,formData);
  }
  GrammerCheck(val:any){
    // return this.http.get<any>(environment.Grammerurl,{params: val});
  }
}
