import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {PostApplicationState} from "./store/post-application.reducer";
import {loadSubModules} from "./store/post-application.actions";
import {selectSubModule$} from "./store/post-applicaiton.selectors";

@Injectable({
  providedIn: 'root'
})
export class PostApplicationService {

  constructor(private store: Store<PostApplicationState>) { }

  loadSubModules(countryId: number) {
    this.store.dispatch(loadSubModules({countryId}));
  }
  subModuleList$() {
    return this.store.select(selectSubModule$);
  }
}
