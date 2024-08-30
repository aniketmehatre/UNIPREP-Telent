import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobHuntComponent } from './job-hunt.component';

describe('JobHuntComponent', () => {
  let component: JobHuntComponent;
  let fixture: ComponentFixture<JobHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobHuntComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
