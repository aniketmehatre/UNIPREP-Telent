import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SopSampleService {

  constructor(private http: HttpClient) { }
  
  getsopSample(){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));
    return this.http.get<any>(environment.ApiUrl+'/sample/category',{'headers': headers});
    // return this.http.get(environment.ApiUrl+'/sample/category')
  }
  getsubCatgorySop(url:any){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));
    return this.http.get<any>(environment.ApiUrl+'/sample/category/'+url,{'headers': headers});
    // return this.http.get(environment.ApiUrl+'/sample/category')

  }
  getSoplist(url:any){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));
    return this.http.get<any>(environment.ApiUrl+'/sample/subcategory/'+url,{'headers': headers});
    // return this.http.get(environment.ApiUrl+'/sample/category')

  }
  displaypdfconent(url:any){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));
    return this.http.get<any>(environment.ApiUrl+'/sample/sop/'+url,{'headers': headers});
    // return this.http.get(environment.ApiUrl+'/sample/category')

  }
}
