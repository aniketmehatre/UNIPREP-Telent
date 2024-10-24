import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamStartComponent } from './national-exam-start.component';

describe('NationalExamStartComponent', () => {
  let component: NationalExamStartComponent;
  let fixture: ComponentFixture<NationalExamStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
