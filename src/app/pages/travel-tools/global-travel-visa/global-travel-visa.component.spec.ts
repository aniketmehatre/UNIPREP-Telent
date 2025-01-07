import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTravelVisaComponent } from './global-travel-visa.component';

describe('GlobalTravelVisaComponent', () => {
  let component: GlobalTravelVisaComponent;
  let fixture: ComponentFixture<GlobalTravelVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalTravelVisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalTravelVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
