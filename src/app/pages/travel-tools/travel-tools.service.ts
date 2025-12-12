import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { Countries } from 'src/app/@Models/country.model';
import { CountryandCurrency } from 'src/app/@Models/currency.model';
import { map } from 'rxjs';
import { removeExtraResponse } from '../../@Supports/prompt';

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
    }).pipe(
      map(res => ({ response: removeExtraResponse(res.response) })) // Process response before returning
    );
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
  
  downloadAiRecommendation(data: any){
    return this.http.post<any>(environment.ApiUrl + "/downloadAiRecommendation", data, {
        headers: this.headers,
    });
  }
  // convertHTMLtoPDF(data: any): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const now = new Date();
  //     const timestamp = now.toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "");
  //     const dynamicFileName = `${data.file_name}_${timestamp}.pdf`;

  //     html2pdf()
  //       .from(data.response)
  //       .set({
  //         margin: [20, 15, 25, 15],
  //         filename: dynamicFileName,
  //         image: { type: 'jpeg', quality: 1.0 },
  //         html2canvas: {
  //           scale: 2,
  //           useCORS: true,
  //           scrollX: 0,
  //           scrollY: 0,
  //           // letterRendering: true,
  //         },
  //         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  //         // pagebreak: { mode: ['avoid-all', 'css'] }
  //         // pagebreak: { avoid: ['h2', 'h3', 'h4', 'h1', 'h5', 'h6', 'p', 'div', 'span', 'li', 'ul']},
  //       })
  //       .toPdf()
  //       .get('pdf')
  //       .then((pdf: any) => {
  //         const totalPages = pdf.internal.getNumberOfPages();
  //         const headerImg = 'uniprep-assets/images/stream-report-header.png';
  //         const footerImg = 'uniprep-assets/images/stream-report-footer.png';
  //         const pageWidth = pdf.internal.pageSize.getWidth();
  //         const pageHeight = pdf.internal.pageSize.getHeight();

  //         for (let i = 1; i <= totalPages; i++) {
  //           pdf.setPage(i);
  //           // Add header
  //           pdf.addImage(headerImg, 'JPEG', 0, 0, pageWidth, 15); // Adjust position and size
  //           // Add footer
  //           pdf.addImage(footerImg, 'JPEG', 0, pageHeight - 10, pageWidth, 10); // Adjust position and size
  //         }
  //         pdf.setProperties({ title: data.module_name });
  //         resolve();
  //       })
  //       .save()
  //       .catch((error: any) => reject(error));
  //   });
  // }

  // generatePDF() {
  //   const now = new Date();
  //   const timestamp = now.toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "");
  //   const dynamicFileName = `travel_plan_${timestamp}.pdf`;
  
  //   html2pdf()
  //     .from(document.body)
  //     .set({
  //       margin: 15,
  //       filename: dynamicFileName,
  //       image: { type: 'jpeg', quality: 1.0 },
  //       html2canvas: { scale: 3, useCORS: true },
  //       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //     })
  //     .save();
  // }
}
