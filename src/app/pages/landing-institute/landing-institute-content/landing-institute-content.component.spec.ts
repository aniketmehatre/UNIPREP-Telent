import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingInstituteContentComponent } from './landing-institute-content.component';

describe('LandingInstituteContentComponent', () => {
  let component: LandingInstituteContentComponent;
  let fixture: ComponentFixture<LandingInstituteContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingInstituteContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingInstituteContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
