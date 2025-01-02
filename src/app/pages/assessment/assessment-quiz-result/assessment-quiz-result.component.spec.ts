import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuizResultComponent } from './assessment-quiz-result.component';

describe('AssessmentQuizResultComponent', () => {
  let component: AssessmentQuizResultComponent;
  let fixture: ComponentFixture<AssessmentQuizResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentQuizResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentQuizResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
