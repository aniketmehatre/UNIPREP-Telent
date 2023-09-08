import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {loadQuestionList, loadQuizList, loadSubModules, readQuestion} from './module-store.actions';
import {ModuleStoreState} from "./module-store.reducer";
import {readQuestion$, selectQuestionList$, selectQuizList$, selectSubModule$} from './module-store.selectors';

@Injectable({
  providedIn: 'root'
})
export class ModuleServiceService {
  constructor(private store: Store<ModuleStoreState>) {
  }

  loadSubModules(data: any) {
    this.store.dispatch(loadSubModules({countryId: data.countryId, api_module_name: data.api_module_name}));
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

  quizList(data: any) {
    this.store.dispatch(loadQuizList({
      countryId: data.countryId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId
    }));
  }
  quizList$() {
    return this.store.select(selectQuizList$);
  }

  readQuestion(data: any) {
    this.store.dispatch(readQuestion({
      countryId: data.countryId,
      questionId: data.questionId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId
    }));
  }
  readQuestionMessage$() {
    return this.store.select(readQuestion$);
  }
}
