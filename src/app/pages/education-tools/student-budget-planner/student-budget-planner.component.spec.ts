import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBudgetPlannerComponent } from './student-budget-planner.component';

describe('StudentBudgetPlannerComponent', () => {
  let component: StudentBudgetPlannerComponent;
  let fixture: ComponentFixture<StudentBudgetPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentBudgetPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentBudgetPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
