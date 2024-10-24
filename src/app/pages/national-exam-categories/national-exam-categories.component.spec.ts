import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalExamCategoriesComponent } from './national-exam-categories.component';

describe('NationalExamCategoriesComponent', () => {
  let component: NationalExamCategoriesComponent;
  let fixture: ComponentFixture<NationalExamCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalExamCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalExamCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
