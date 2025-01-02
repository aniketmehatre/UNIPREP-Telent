import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuizReviewComponent } from './assessment-quiz-review.component';

describe('AssessmentQuizReviewComponent', () => {
  let component: AssessmentQuizReviewComponent;
  let fixture: ComponentFixture<AssessmentQuizReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentQuizReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentQuizReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
