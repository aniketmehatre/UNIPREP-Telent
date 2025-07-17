import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {StorageService} from "../../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class LanguageHubDataService {

  constructor(private storage: StorageService) { }

  private dataSubject = new BehaviorSubject<any>(this.storage.get('languageId') || '');
  data$ = this.dataSubject.asObservable();

  private dataLanguage = new BehaviorSubject<any>(this.storage.get('languageName') || '');
  dataLanguageName$ = this.dataLanguage.asObservable();

  private languageType = new BehaviorSubject<any>(this.storage.get('languageType') || '');
  dataLanguageType$ = this.languageType.asObservable();

  private languageTypeName = new BehaviorSubject<any>(this.storage.get('languageTypeName') || '');
  dataLanguageTypeName$ = this.languageTypeName.asObservable();

  private languageCode = new BehaviorSubject<any>(this.storage.get('languageCode') || '');
  dataLanguageCode$ = this.languageCode.asObservable();

  private submoduleName = new BehaviorSubject<any>(this.storage.get('selectedSubmoduleName') || '');
  dataSubmoduleName$ = this.submoduleName.asObservable();

  setLanguageData(data: any) {
    this.storage.set('languageId', data);
    this.dataSubject.next(data);
  }

  setDataLanguageName(data: any) {
    this.storage.set('languageName', data);
    this.dataLanguage.next(data);
  }

  setDataLanguageType(data: any) {
    this.storage.set('languageType', data);
    this.languageType.next(data);
  }

  setDataLanguageTypeName(data: any) {
    this.storage.set('languageTypeName', data);
    this.languageTypeName.next(data);
  }

  setLanguageCode(data: any) {
    this.storage.set('languageCode', data);
    this.languageCode.next(data);
  }
}
