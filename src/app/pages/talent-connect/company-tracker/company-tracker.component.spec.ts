import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTrackerComponent } from './company-tracker.component';

describe('CompanyTrackerComponent', () => {
  let component: CompanyTrackerComponent;
  let fixture: ComponentFixture<CompanyTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
