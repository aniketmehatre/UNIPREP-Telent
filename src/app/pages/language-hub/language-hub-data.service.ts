import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageHubDataService {

  constructor() { }

  private dataSubject = new BehaviorSubject<any>(localStorage.getItem('languageId') || '');
  data$ = this.dataSubject.asObservable();

  private dataLanguage = new BehaviorSubject<any>(localStorage.getItem('languageName') || '');
  dataLanguageName$ = this.dataLanguage.asObservable();

  private languageType = new BehaviorSubject<any>(localStorage.getItem('languageType') || '');
  dataLanguageType$ = this.languageType.asObservable();


  setLanguageData(data: any) {
    localStorage.setItem('languageId', data);
    this.dataSubject.next(data);
  }

  setDataLanguageName(data: any) {
    localStorage.setItem('languageName', data);
    this.dataLanguage.next(data);
  }

  setDataLanguageType(data: any) {
    localStorage.setItem('languageType', data);
    this.languageType.next(data);
  }
}
