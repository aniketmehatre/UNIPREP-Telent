import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ContributorDropDownRes, ContributorRes } from 'src/app/@Models/contributor.model';

@Injectable({
  providedIn: 'root'
})
export class ContributorsService {

  constructor(private http: HttpClient) { }

  getContributors(val:any) {
    return this.http.post<ContributorRes>(environment.ApiUrl + "/getcontributorlists", val);
  }

  getContributorDropDownList() {
    return this.http.get<ContributorDropDownRes>(`${environment.ApiUrl}/contributordropdownlist`);
}

}
