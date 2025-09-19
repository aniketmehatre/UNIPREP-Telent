import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProgramComponent } from './training-program.component';

describe('TrainingProgramComponent', () => {
  let component: TrainingProgramComponent;
  let fixture: ComponentFixture<TrainingProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TrainingProgramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
