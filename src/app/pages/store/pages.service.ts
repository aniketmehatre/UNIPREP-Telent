import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleSideBar } from './pages.actions';
import { PageState } from './pages.reducer';
import { selectSideBarState } from './pages.selectors';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(
    private store: Store<PageState>
  ) {}

  selectSideBarState(): Observable<boolean> {
    return this.store.select(selectSideBarState);
  }
  toggleSideBar(state: boolean) {
    this.store.dispatch(toggleSideBar({state}));
  }
}
