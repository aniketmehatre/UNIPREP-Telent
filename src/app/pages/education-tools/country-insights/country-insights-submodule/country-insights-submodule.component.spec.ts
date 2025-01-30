import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryInsightsSubmoduleComponent } from './country-insights-submodule.component';

describe('CountryInsightsSubmoduleComponent', () => {
  let component: CountryInsightsSubmoduleComponent;
  let fixture: ComponentFixture<CountryInsightsSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryInsightsSubmoduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryInsightsSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
