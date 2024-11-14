import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamReviewComponent } from './national-exam-review.component';

describe('NationalExamReviewComponent', () => {
  let component: NationalExamReviewComponent;
  let fixture: ComponentFixture<NationalExamReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
