import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from 'rxjs';

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

  bookmarkCourseData(pitchId:any,user_id:any,fav:any){
    let params={ 
      pitch_id:pitchId,
      user_id :user_id,
      updateFavourite:fav
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addpitchfavourite", params, {
      headers: headers,
    });
  }

  downloadPdf(pdfUrl: string, fileName: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        // Append to body, click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the URL
        window.URL.revokeObjectURL(url);
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

  singleCreditReduce(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ReduceSingleCredits", data, {
      headers: headers,
    });
  }

  getPdfFile(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }
}
