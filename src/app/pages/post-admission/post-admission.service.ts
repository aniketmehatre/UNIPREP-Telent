import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import { loadSubModules } from './store/post-admission.actions';
import {PostAdmissionState} from "./store/post-admission.reducer";
import {selectSubModule$} from "./store/post-admission.selectors";

@Injectable({
    providedIn: 'root'
})
export class PostAdmissionService {


    constructor(private store: Store<PostAdmissionState>) {
    }

    loadSubModules() {
        this.store.dispatch(loadSubModules());
    }

    subModuleList$() {
        return this.store.select(selectSubModule$);
    }
}
