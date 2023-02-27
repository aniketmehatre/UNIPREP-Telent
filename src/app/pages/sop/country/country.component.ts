import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import { SopService } from "../sop.service";
import {Observable} from "rxjs";
import {Course} from "../../../@Models/course.model";
import {Country} from "../../../@Models/country.model";
import {Univercity} from "../../../@Models/univercity.model";

@Component({
  selector: "uni-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.scss"],
})
export class CountryComponent implements OnInit {
  countries$!: Observable<Country[]>;
  courses$!: Observable<Course[]>;
  univercities$!: Observable<Univercity[]>;
  isEnabled$!: Observable<boolean>;
  constructor(private _sopService: SopService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.courses$ = this._sopService.courseList$();
    this.countries$ = this._sopService.countriesList$();
    this.univercities$ = this._sopService.univercityByCountryList$();
    this.isEnabled$ = this._sopService.isAnalyseBtnEnabaled$();
    this._sopService.loadCourses();
    this._sopService.loadCountries();
  }
  oncountryselect(countryid: any) {
    this.currentCountry = countryid;
    this._sopService.loadUnivercityByCountry(countryid);
  }
  currentCountry = -1;
  isCountrySelected(param: number): boolean {
    return this.currentCountry === param;
  }
  onUnivercitySelect(data: any) {
    this._sopService.onSelectUnivercity(data.value.id);
  }
  onCoursesSelect(data: any) {
    this._sopService.onSelectCourses(data.value.map((d: any) => d.id));
  }
  analyse() {
    this._sopService.setOptions();
  }
}
