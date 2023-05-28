import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreditComponent } from './question-credit.component';

describe('QuestionCreditComponent', () => {
  let component: QuestionCreditComponent;
  let fixture: ComponentFixture<QuestionCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
