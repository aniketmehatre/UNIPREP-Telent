import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {loadQuestionList, loadSubModules} from './store/post-admission.actions';
import {PostAdmissionState} from "./store/post-admission.reducer";
import {selectQuestionList$, selectSubModule$} from "./store/post-admission.selectors";
import {loadQuizList} from "../pre-application/store/pre-application.actions";
import {selectQuizList$} from "../pre-application/store/pre-application.selectors";

@Injectable({
    providedIn: 'root'
})
export class PostAdmissionService {


    constructor(private store: Store<PostAdmissionState>) {
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

}
