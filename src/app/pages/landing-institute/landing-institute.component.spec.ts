import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingInstituteComponent } from './landing-institute.component';

describe('LandingInstituteComponent', () => {
  let component: LandingInstituteComponent;
  let fixture: ComponentFixture<LandingInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingInstituteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
