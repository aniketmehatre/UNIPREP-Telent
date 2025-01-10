import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FounderstoolService {

  constructor(private http: HttpClient) { }
  getAcademy(val:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/founderslist",val, {
        headers: headers,
    });
  }
  getFounderCategory() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getfoundercategory", {
        headers: headers,
    });
  }
  // investor training
  getAInvestorTraining() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/listinvestorpitch", {
        headers: headers,
    });
  }
  // startup glossary
  getStartUpGlossary(val:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/liststartupglossary",val, {
        headers: headers,
    });
  }
  // entrprenuerskill
  getEntreprenuerTest(val:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getentrepreneurtestlist",val, {
        headers: headers,
    });
  }
  // quiz 
  GetQuestionsCount(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getrandomquizlh", data, {
            headers: headers,
        });
}
submitQuiz(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/submitquizanswers", data, {
      headers: headers,
  });
}
ReviewQuiz(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/reviewquiz", data, {
      headers: headers,
  });
}
quizCount(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getrandomquizlh", data, {
      headers: headers,
  });
}
checkModuleQuizCompletion(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/checkmodulequizcompletion", data, {
      headers: headers,
  });
}

  getFundList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getscholarshiplist", val, {
      headers: headers,
    });
  }

  getFundType() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getFundtype", { headers: headers });
  }

  bookmarkFundData(Fund_id: any, user_id: any, fav: any) {
    let params = {
      Fund_id: Fund_id,
      user_id: user_id,
      updateFavourite: fav
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addFundfavourite", params, {
      headers: headers,
    });
  }

  exportSelectedData(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditexportData", data, {
      headers: headers,
    });
  }

  getFundCountry(scholarship_country: number) {
    let params = new HttpParams();
    params = params.append("fund_country", scholarship_country)
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers, params: params
    });
  }

  getFunderCountry() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/scholarCountry", {
      headers: headers
    });
  }


  storeRecommendation(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/storeScholarRec", data, {
      headers: headers,
    });
  }

  getRecommendations() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getScholarRec", {
      headers: headers,
    });
  }

  resetRecommendation() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/resetScholarRec", {
      headers: headers,
    });
  }
}
