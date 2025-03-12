import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTracker1Component } from './company-tracker.component';

describe('CompanyTracker1Component', () => {
  let component: CompanyTracker1Component;
  let fixture: ComponentFixture<CompanyTracker1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyTracker1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyTracker1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
