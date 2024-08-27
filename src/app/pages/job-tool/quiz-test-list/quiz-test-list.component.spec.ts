import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTestListComponent } from './quiz-test-list.component';

describe('QuizTestListComponent', () => {
  let component: QuizTestListComponent;
  let fixture: ComponentFixture<QuizTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizTestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
