import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamResultComponent } from './national-exam-result.component';

describe('NationalExamResultComponent', () => {
  let component: NationalExamResultComponent;
  let fixture: ComponentFixture<NationalExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
