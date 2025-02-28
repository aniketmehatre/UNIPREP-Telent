import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { Countries } from 'src/app/@Models/country.model';
import { CountryandCurrency } from 'src/app/@Models/currency.model';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class TravelToolsService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getCurrencies() {
    return this.http.post<CountryandCurrency[]>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers,
    });
  }

  getChatgptRecommendations(data: any) {
    return this.http.post<{ response: any }>(environment.ApiUrl + "/getIntegratedRecom", data, {
      headers: this.headers,
    });
  }

  getCountriesList() {
    return this.http.post<Countries[]>(environment.ApiUrl + "/AllCountries", {
      headers: this.headers,
    });
  }
  getVisaCountriesList(data:any) {
    return this.http.post<Countries[]>(environment.ApiUrl + "/getvisacountrylist",data, {
      headers: this.headers,
    });
  }
  getTripList(type: string) {
    return this.http.get<ChatGPTResponse>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
      headers: this.headers,
    });
  }

  getStravelGlossary(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/travelGlossaryList", val, {
      headers: headers,
    });
  }

  getVisaRecommendations(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getVisaRecom", data, {
      headers: this.headers,
    });
  }
  getVisaRecommendationsAllList(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/gettravelvisalist", data, {
      headers: this.headers,
    });
  }


  getVisaCategoryList(visaId: number, questionId?: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new HttpParams().set('visa_id', visaId);
    if (questionId) {
      params = params.set('question_id', questionId);
    }
    return this.http.get<any[]>(`${environment.ApiUrl}/getVisaCategories`, {
      headers, params
    });
  }

  downloadRecommendation(data: any) {
    return this.http.post<{ url: string }>(environment.ApiUrl + "/downloadIntegratedRecom", data, {
      headers: this.headers,
    });
  }

  convertHTMLtoPDF(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "");
      const dynamicFileName = `${data.file_name}_${timestamp}.pdf`; 
      html2pdf()
        .from(data.response)
        .set({
          margin: 15,
          filename: dynamicFileName,
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { scale: 3, useCORS: true }, // Remove 'dpi' & 'letterRendering' (deprecated)
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .toPdf()
        .get('pdf')
        .then((pdf: any) => {
          pdf.internal.scaleFactor = 1;
          pdf.setProperties({ title: data.module_name });
          resolve(); // Mark promise as completed
        })
        .save()
        .catch((error: any) => reject(error)); // Catch and handle errors
    });
  }
  
}
