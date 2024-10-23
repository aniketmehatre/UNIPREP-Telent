import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamTestsComponent } from './national-exam-tests.component';

describe('NationalExamTestsComponent', () => {
  let component: NationalExamTestsComponent;
  let fixture: ComponentFixture<NationalExamTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
