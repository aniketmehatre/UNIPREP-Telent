import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PreApplicationState} from "./store/pre-application.reducer";
import {loadQuestionList, loadQuizList, loadSubModules} from "./store/pre-application.actions";
import {selectQuestionList$, selectQuizList$, selectSubModule$} from "./store/pre-application.selectors";

@Injectable({
    providedIn: 'root'
})
export class PreAppService {

    constructor(private store: Store<PreApplicationState>) {
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
