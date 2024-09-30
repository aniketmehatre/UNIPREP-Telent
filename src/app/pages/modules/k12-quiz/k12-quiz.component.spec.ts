import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12QuizComponent } from './k12-quiz.component';

describe('K12QuizComponent', () => {
  let component: K12QuizComponent;
  let fixture: ComponentFixture<K12QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12QuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
