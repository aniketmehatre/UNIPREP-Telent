import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class LanguageHubService {

  constructor(private http: HttpClient) { }

  // language listing
  getLanguageList(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguages", req, {
      headers: headers,
    });
  }

  getVocabulary(req: any) {
    if (req){
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.get(environment.ApiUrl + `/getvocabulary?letter=${req}`,   {
        headers: headers,
      });
    }else{
      const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.get<any>(environment.ApiUrl + "/getvocabulary",  {
        headers: headers,
      });
    }
     
  }

  learningVideos(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + `/language_hub_learning_videos?language_id=${req}`,   {
      headers: headers,
    }); 
  }


  getLanguageTypeList(data: any) {
    let req = {
      languageid: data
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagetype", req, {
      headers: headers,
    });
  }

  getCategoryList(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagesubmodule", req, {
      headers: headers,
    });
  }

  getQuestionList(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagequestions", req, {
      headers: headers,
    });
  }
  checklanguageQuizCompletion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/languagehubquizcompletion", data, {
      headers: headers,
    });
  }
  getQuestion(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagequestions", req, {
      headers: headers,
    });
  }
}
