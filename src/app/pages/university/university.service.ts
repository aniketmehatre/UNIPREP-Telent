import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {loadQuestionList, loadSubModules } from './store/university.actions';
import {UniversityState} from "./store/university.reducer";
import {selectQuestionList$, selectSubModule$} from "./store/university.selectors";

@Injectable({
  providedIn: 'root'
})
export class UniversityService {


  constructor(private store: Store<UniversityState>) {
  }

  loadSubModules(countryId: number) {
    this.store.dispatch(loadSubModules({countryId}));
  }

  subModuleList$() {
    return this.store.select(selectSubModule$);
  }

  loadQuestionList(data: any) {
    this.store.dispatch(loadQuestionList({
      countryId: data.countryId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId
    }));
  }

  questionList$() {
    return this.store.select(selectQuestionList$);
  }
}
