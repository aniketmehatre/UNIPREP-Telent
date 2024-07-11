import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobToolComponent } from './job-tool.component';

describe('JobToolComponent', () => {
  let component: JobToolComponent;
  let fixture: ComponentFixture<JobToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
