import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {PreApplicationState} from "./store/pre-application.reducer";
import {loadSubModules} from "./store/pre-application.actions";
import {selectSubModule$} from "./store/pre-application.selectors";

@Injectable({
  providedIn: 'root'
})
export class PreAppService {

  constructor(private store: Store<PreApplicationState>) { }

  loadSubModules() {
    this.store.dispatch(loadSubModules());
  }
  subModuleList$() {
    return this.store.select(selectSubModule$);
  }
}
