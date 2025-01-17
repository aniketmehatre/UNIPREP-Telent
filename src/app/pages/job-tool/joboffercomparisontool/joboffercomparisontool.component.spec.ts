import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoboffercomparisontoolComponent } from './joboffercomparisontool.component';

describe('JoboffercomparisontoolComponent', () => {
  let component: JoboffercomparisontoolComponent;
  let fixture: ComponentFixture<JoboffercomparisontoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoboffercomparisontoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoboffercomparisontoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
