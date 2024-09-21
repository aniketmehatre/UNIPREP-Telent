import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewJobrolesComponent } from './interview-jobroles.component';

describe('InterviewJobrolesComponent', () => {
  let component: InterviewJobrolesComponent;
  let fixture: ComponentFixture<InterviewJobrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewJobrolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewJobrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
