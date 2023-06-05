import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PostApplicationState} from "./store/post-application.reducer";
import {loadQuestionList, loadSubModules} from "./store/post-application.actions";
import {selectQuestionList$, selectSubModule$} from "./store/post-applicaiton.selectors";

@Injectable({
    providedIn: 'root'
})
export class PostApplicationService {

    constructor(private store: Store<PostApplicationState>) {
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
