import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListGuidlinesComponent } from './company-list-guidlines.component';

describe('CompanyListGuidlinesComponent', () => {
  let component: CompanyListGuidlinesComponent;
  let fixture: ComponentFixture<CompanyListGuidlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyListGuidlinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyListGuidlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
