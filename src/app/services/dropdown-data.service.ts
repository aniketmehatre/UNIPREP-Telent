import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TalentSupportService } from './talent-support.service';
import { DropdownListData } from '../@Models/talent-support.model';

const EMPTY_DROPDOWNS: DropdownListData = {
  hiringtypes: [],
  institute_countries: [],
  institutes: [],
  positions: [],
  industrytypes: [],
  softskills: [],
  language: [],
  benifitandperks: [],
  compensationstructure: [],
  employmenttype: [],
  hiringstage: [],
  workmode: [],
  minimumeducation: [],
  currencycode: [],
  gender: [],
  experiecelevel: [],
  timeframe: [],
  interviewformat: [],
  proficiencylevel: [],
  departments: [],
};

@Injectable({ providedIn: "root" })
export class DropdownDataService {
  private refresh$ = new Subject<void>();

  private all$: Observable<DropdownListData> = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.fetchAll()),
    shareReplay(1)
  );

  constructor(private talentSupportService: TalentSupportService) {}

  /**
   * Returns a cached stream of all dropdown lists.
   */
  getAll$(): Observable<DropdownListData> {
    return this.all$;
  }

  /**
   * Select a single dropdown list as an Observable.
   */
  select<K extends keyof DropdownListData>(
    key: K
  ): Observable<DropdownListData[K]> {
    return this.all$.pipe(map((d) => d?.[key] ?? EMPTY_DROPDOWNS[key]));
  }

  /**
   * Forces a re-fetch of dropdown lists.
   */
  refresh(): void {
    this.refresh$.next();
  }

  private fetchAll(): Observable<DropdownListData> {
    return this.talentSupportService.getDropdownData().pipe(
      map((res) => ({
        ...EMPTY_DROPDOWNS,
        ...res,
      })),
      catchError((err) => {
        // Keep UI resilient by returning empties on error
        console.warn("Failed to load dropdown data", err);
        return of(EMPTY_DROPDOWNS);
      })
    );
  }


}
