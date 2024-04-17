import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
const saveAs = require('file-saver');


@Injectable({
  providedIn: 'root'
})
export class PitchDeskService {

  constructor(private http: HttpClient) { }

  getPitchDeskData(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/PitchDeckList",data, {
      headers: headers,
    });
  }

  downloadPdf(pdfUrl: string, fileName: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' })
        .subscribe((blob: Blob) => {
          saveAs(blob, fileName);
        });
  }

  getSelectBoxValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/PitchdeckSelectbox", {
      headers: headers,
    });
  }

  exportSelectedData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditexportData", data, {
      headers: headers,
    });
  }
}
