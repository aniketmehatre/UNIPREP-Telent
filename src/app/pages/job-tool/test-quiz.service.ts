import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestQuizService {

  constructor(private http: HttpClient) {}

  getCategoryListData(): Observable<any> {
    return this.http.get<any>('uniprep-assets/sample-json/pyshometric-test.json');
  }
  getQuizListData(): Observable<any> {
    return this.http.get<any>('uniprep-assets/sample-json/test.json');
  }

}