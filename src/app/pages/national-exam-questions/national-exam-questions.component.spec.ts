import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamQuestionsComponent } from './national-exam-questions.component';

describe('NationalExamQuestionsComponent', () => {
  let component: NationalExamQuestionsComponent;
  let fixture: ComponentFixture<NationalExamQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
