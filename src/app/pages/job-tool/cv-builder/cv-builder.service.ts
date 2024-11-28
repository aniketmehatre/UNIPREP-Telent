import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { BehaviorSubject } from 'rxjs';
const saveAs = require('file-saver');

@Injectable({
  providedIn: 'root'
})
export class CvBuilderService {

  constructor(private http: HttpClient) { }
  headers:any = new HttpHeaders().set("Accept", "application/json");

  downloadResume(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/downloadResume", data ,{
      headers: headers,
    });
  }

  private dataSubject = new BehaviorSubject<boolean>(false);
  data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getAlreadyCreatedResumes(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/resumeHistories",{
      headers: headers,
    });
  }

  deleteResumes(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/deleteUserResumes", data ,{
      headers: headers,
    });
  }

  getCountryCodes(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/CountryCode" ,{
      headers: headers,
    });
  }

  getSkills(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getSkillsList" ,{
      headers: headers,
    });
  }

  downloadPdf(pdfUrl: string, fileName: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
          saveAs(blob, fileName);
    });
  }

  getCVPrefilledData(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/cvPrefilledData" ,{
      headers: headers,
    });
  }

  storeUserFilledData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/storeFiledData", data ,{
      headers: headers,
    });
  }
  
  getLocationList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getCitiesList" ,{
      headers: headers,
    });
  }

  getJobList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getJobRolesList" ,{
      headers: headers,
    });
  }

  openAiIntegration(req: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/AiIntegration", req ,{
      headers: headers,
    });
  }
}
