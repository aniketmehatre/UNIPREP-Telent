import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupRiskAssessmentComponent } from './startup-risk-assessment.component';

describe('StartupRiskAssessmentComponent', () => {
  let component: StartupRiskAssessmentComponent;
  let fixture: ComponentFixture<StartupRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartupRiskAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
