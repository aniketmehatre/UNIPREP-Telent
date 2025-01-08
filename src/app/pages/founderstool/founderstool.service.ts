import { HttpClient, HttpHeaders } from '@angular/common/http';
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
// wealth leaders
wealthLeadersList(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getwealthleaderlist", data, {
      headers: headers,
  });
}
getCountry() {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.get<any>(environment.ApiUrl + "/getwealthleadercountrylist", {
      headers: headers,
  });
}
wealthLeadersListquizAns(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getwealthleaderqa", data, {
      headers: headers,
  });
}
wealthLeadersquestion(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getwealthleaderquestion", data, {
      headers: headers,
  });
}
wealthLeadersans(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getwealthleaderanswer", data, {
      headers: headers,
  });
}
}
