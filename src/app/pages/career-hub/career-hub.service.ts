import { Injectable } from '@angular/core';
import { CareerHubState } from './store/career-hub.reducer';
import { Store } from '@ngrx/store';
import { loadSubModules } from './store/career-hub.actions';
import { selectSubModule$ } from './store/career-hub.selectors';

@Injectable({
  providedIn: 'root'
})
export class CareerHubService {

  constructor(private store: Store<CareerHubState>) { }

  loadSubModules(countryId: number) {
    this.store.dispatch(loadSubModules({countryId}));
  }
  subModuleList$() {
    return this.store.select(selectSubModule$);
  }
}
