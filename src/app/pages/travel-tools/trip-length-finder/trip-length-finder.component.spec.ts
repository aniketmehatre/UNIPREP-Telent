import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLengthFinderComponent } from './trip-length-finder.component';

describe('TripLengthFinderComponent', () => {
  let component: TripLengthFinderComponent;
  let fixture: ComponentFixture<TripLengthFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripLengthFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripLengthFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
